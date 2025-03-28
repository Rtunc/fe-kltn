import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Slide,
} from '@mui/material';
import { DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

// Custom transition for the snackbar
const SlideTransition = (props) => {
  return <Slide {...props} direction="down" />;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [models, setModels] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedModel, setSelectedModel] = useState('');
  const [trainingLoading, setTrainingLoading] = useState(false);
  const [openModelDialog, setOpenModelDialog] = useState(false);
  const [selectedModelForActivation, setSelectedModelForActivation] = useState(null);
  
  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const verifyToken = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get('/api/admin/verify');
        setUserData(response.data);
      } catch (error) {
        console.error('Token verification failed:', error);
        setError(error.response?.data?.detail || 'Failed to verify token');
        if (error.response?.status === 401) {
          navigate('/admin-page/login');
        }
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [navigate]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axiosInstance.get('/admin/models');
        // Sắp xếp models theo thời gian từ mới đến cũ
        const sortedModels = response.data.sort((a, b) => 
          new Date(b.trained_time) - new Date(a.trained_time)
        );
        console.log(sortedModels);
        setModels(sortedModels);
      } catch (error) {
        console.error('Failed to fetch models:', error);
        showNotification('Không thể tải danh sách mô hình', 'error');
      }
    };

    fetchModels();
  }, []);

  // Function to show notification
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Handle notification close
  const handleNotificationClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({
      ...notification,
      open: false,
    });
  };

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-page/login');
  };

  const handleLogoutCancel = () => {
    setOpenLogoutDialog(false);
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleTrainModel = async () => {
    if (!startDate || !endDate || !selectedModel) {
      showNotification('Vui lòng chọn đầy đủ thông tin trước khi huấn luyện mô hình', 'error');
      return;
    }

    try {
      setTrainingLoading(true);
      // Gửi yêu cầu huấn luyện mô hình
      await axiosInstance.post('/admin/train-model', {
        model_type: selectedModel,
        start_date: startDate.format('YYYY-MM-DD'),
        end_date: endDate.format('YYYY-MM-DD')
      });
      
      showNotification('Đã gửi yêu cầu huấn luyện mô hình thành công!', 'success');
      
      // Cập nhật lại danh sách mô hình sau khi huấn luyện
      const response = await axiosInstance.get('/admin/models');
      const sortedModels = response.data.sort((a, b) => 
        new Date(b.trained_time) - new Date(a.trained_time)
      );
      setModels(sortedModels);
    } catch (error) {
      console.error('Failed to train model:', error);
      showNotification('Huấn luyện mô hình thất bại: ' + (error.response?.data?.detail || error.message), 'error');
    } finally {
      setTrainingLoading(false);
    }
  };

  const handleModelRowClick = (model) => {
    setSelectedModelForActivation(model);
    setOpenModelDialog(true);
  };

  const handleActivateModel = async () => {
    if (!selectedModelForActivation) return;

    try {
      console.log(selectedModelForActivation);
      // Call API to activate model using query parameter
      await axiosInstance.post(`/admin/activate-model?model_path=${selectedModelForActivation.model_path}`);
      
      // Refresh model list after activation
      const response = await axiosInstance.get('/admin/models');
      const sortedModels = response.data.sort((a, b) => 
        new Date(b.trained_time) - new Date(a.trained_time)
      );
      setModels(sortedModels);
      
      // For now, just close the dialog
      setOpenModelDialog(false);
      setSelectedModelForActivation(null);
      
      // Show success message
      showNotification('Mô hình đã được kích hoạt thành công!', 'success');
    } catch (error) {
      console.error('Failed to activate model:', error);
      showNotification('Không thể kích hoạt mô hình: ' + (error.response?.data?.detail || error.message), 'error');
    }
  };

  const handleModelDialogCancel = () => {
    setOpenModelDialog(false);
    setSelectedModelForActivation(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {userData && (
            <Typography variant="body1">
              Welcome, {userData.username}
            </Typography>
          )}
          <Button variant="contained" color="error" onClick={handleLogoutClick}>
            Logout
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Huấn Luyện Mô Hình
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}>
              <Box sx={{ minWidth: 200 }}>
                <DatePicker 
                  placeholder="Ngày bắt đầu"
                  onChange={setStartDate}
                  style={{ width: '100%' }}
                  disabledDate={(current) => {
                    return current && (current < new Date('2014-05-01') || current > new Date());
                  }}
                />
              </Box>
              <Box sx={{ minWidth: 200 }}>
                <DatePicker 
                  placeholder="Ngày kết thúc"
                  onChange={setEndDate}
                  style={{ width: '100%' }}
                  disabledDate={(current) => {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    return current && current > yesterday;
                  }}
                />
              </Box>
              <FormControl sx={{ minWidth: 200, height: 40 }}>
                <InputLabel id="model-select-label">Chọn mô hình</InputLabel>
                <Select
                  labelId="model-select-label"
                  value={selectedModel}
                  label="Chọn mô hình"
                  onChange={handleModelChange}
                  size="small"
                >
                  <MenuItem value="lstm">LSTM</MenuItem>
                  <MenuItem value="patchtst">PatchTST</MenuItem>
                </Select>
              </FormControl>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleTrainModel}
                disabled={trainingLoading}
                sx={{ height: 40 }}
              >
                {trainingLoading ? <CircularProgress size={24} /> : 'Huấn luyện'}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h6">
                  Danh sách mô hình
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                color="primary"
                sx={{ height: 40, width: 100 }}
                onClick={() => {
                  // Show loading state if needed
                  const triggerForecast = async () => {
                    try {
                      const response = await fetch('http://localhost:8000/trigger-forecast-7-days-dag/', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                      });
                      
                      if (response.ok) {
                        // Handle successful response 
                        showNotification('Đã kích hoạt tiến trình dự báo thành công!', 'success');
                      } else {
                        // Handle error response
                        showNotification('Không thể kích hoạt tiến trình dự báo. Vui lòng thử lại sau.', 'error');
                      }
                    } catch (error) {
                      console.error('Error triggering forecast:', error);
                      showNotification('Đã xảy ra lỗi khi kích hoạt tiến trình dự báo.', 'error');
                    }
                  };
                  
                  triggerForecast();
                }}
              >
                Dự báo
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Model Name</TableCell>
                    <TableCell>MAE</TableCell>
                    <TableCell>RMSE</TableCell>
                    <TableCell>R2 Score</TableCell>
                    <TableCell>MAPE</TableCell>
                    <TableCell>Test Loss</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Trained Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {models
                    .sort((a, b) => {
                      // First sort by trained_time in descending order
                      const dateComparison = new Date(b.trained_time) - new Date(a.trained_time);
                      
                      // If dates are the same, sort by rmse in ascending order
                      if (dateComparison === 0) {
                        return (a.rmse || 0) - (b.rmse || 0);
                      }
                      
                      return dateComparison;
                    })
                    .map((model, index) => (
                    <TableRow 
                      key={index}
                      onClick={() => handleModelRowClick(model)}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          cursor: 'pointer'
                        } 
                      }}
                    >
                      <TableCell>{model.model || 'N/A'}</TableCell>
                      <TableCell>{model.mae?.toFixed(4) || 'N/A'}</TableCell>
                      <TableCell>{model.rmse?.toFixed(4) || 'N/A'}</TableCell>
                      <TableCell>{model.r2?.toFixed(4) || 'N/A'}</TableCell>
                      <TableCell>{model.mape?.toFixed(4) || 'N/A'}</TableCell>
                      <TableCell>{model.test_loss?.toFixed(4) || 'N/A'}</TableCell>
                      <TableCell>
                        <Typography
                          color={model.is_active ? 'success.main' : 'error.main'}
                        >
                          {model.is_active ? 'Active' : 'Inactive'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(model.trained_time).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
      >
        <DialogTitle id="logout-dialog-title">
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to logout?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="error" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      {/* Model Activation Dialog */}
      <Dialog
        open={openModelDialog}
        onClose={handleModelDialogCancel}
        aria-labelledby="model-dialog-title"
      >
        <DialogTitle id="model-dialog-title">
          Kích hoạt mô hình
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có muốn sử dụng Model này không?
          </Typography>
          {selectedModelForActivation && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Model:</strong> {selectedModelForActivation.model}
              </Typography>
              <Typography variant="body2">
                <strong>MAE:</strong> {selectedModelForActivation.mae?.toFixed(4) || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>RMSE:</strong> {selectedModelForActivation.rmse?.toFixed(4) || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong> {selectedModelForActivation.is_active ? 'Active' : 'Inactive'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModelDialogCancel} color="primary">
            Hủy
          </Button>
          <Button onClick={handleActivateModel} color="success" autoFocus>
            Kích hoạt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleNotificationClose}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          variant="filled"
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem',
              marginRight: '12px',
            },
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {notification.message}
          </Typography>
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard; 