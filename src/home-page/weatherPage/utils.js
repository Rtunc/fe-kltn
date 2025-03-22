export const createInfoPopup = (e, content) => {
  const popup = document.createElement('div');
  const iconRect = e.target.getBoundingClientRect();
  
  popup.style.cssText = `
    position: absolute;
    top: ${iconRect.bottom + 10}px;
    left: ${iconRect.left}px;
    padding: 20px;
    background-color: white;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    border-radius: 12px;
    z-index: 1000;
    max-width: 320px;
    font-size: 14px;
    line-height: 1.5;
    color: #4a4a4a;
    animation: fadeIn 0.2s ease-in;
  `;
  
  popup.innerHTML = content;

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    position: absolute;
    right: 12px;
    top: 12px;
    border: none;
    background: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    transition: color 0.2s;
  `;
  closeBtn.onmouseover = () => closeBtn.style.color = '#000';
  closeBtn.onmouseout = () => closeBtn.style.color = '#666';
  closeBtn.onclick = () => {
    popup.style.animation = 'fadeOut 0.2s ease-out';
    setTimeout(() => document.body.removeChild(popup), 180);
  };

  popup.appendChild(closeBtn);
  document.body.appendChild(popup);
}; 