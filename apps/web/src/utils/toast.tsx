import { toast } from 'react-toastify';
import "./toast.modules.css";

export const showSuccess = (msg: string) =>
  toast.success(msg,  {
    position: 'bottom-center',
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    draggable: false,
    className: 'custom-toast-success',
    icon: <img src="/icons/success.svg" alt="success" style={{ width: '18px', height: '18px' }} />
  });

export const showError = (msg: string) =>
  toast.error(msg, {
    position: 'bottom-center',
    autoClose: 1500,
hideProgressBar: true,
closeOnClick: true,
draggable: false
  });

export const showInfo = (msg: string) =>
  toast.info(msg, {
    position: 'bottom-center',
    autoClose: 1500,
hideProgressBar: true,
closeOnClick: true,
draggable: false
  });
