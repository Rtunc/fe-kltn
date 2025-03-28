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
} from '@mui/material';
import { DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

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
      }
    };

    fetchModels();
  }, []);

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
      alert('Vui lòng chọn đầy đủ thông tin trước khi huấn luyện mô hình');
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
      
      alert('Đã gửi yêu cầu huấn luyện mô hình thành công!');
      
      // Cập nhật lại danh sách mô hình sau khi huấn luyện
      const response = await axiosInstance.get('/admin/models');
      const sortedModels = response.data.sort((a, b) => 
        new Date(b.trained_time) - new Date(a.trained_time)
      );
      setModels(sortedModels);
    } catch (error) {
      console.error('Failed to train model:', error);
      alert('Huấn luyện mô hình thất bại: ' + (error.response?.data?.detail || error.message));
    } finally {
      setTrainingLoading(false);
    }
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
                />
              </Box>
              <Box sx={{ minWidth: 200 }}>
                <DatePicker 
                  placeholder="Ngày kết thúc"
                  onChange={setEndDate}
                  style={{ width: '100%' }}
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
                  <MenuItem value="gru">GRU</MenuItem>
                  <MenuItem value="rnn">RNN</MenuItem>
                  <MenuItem value="cnn">CNN</MenuItem>
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
            <Typography variant="h6" gutterBottom>
              Trained Models
            </Typography>
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
                  {models.map((model, index) => (
                    <TableRow key={index}>
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
    </Container>
  );
};

export default AdminDashboard; 