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
    icon: false 
  });

export const showError = (msg: string) =>
  toast.error(msg, {
    position: 'bottom-center',
    autoClose: 1500,
hideProgressBar: true,
closeOnClick: true,
draggable: false,
icon: false,
className: 'custom-toast-failure',
  });

export const showInfo = (msg: string) =>
  toast.info(msg, {
    position: 'bottom-center',
    autoClose: 1500,
hideProgressBar: true,
closeOnClick: true,
draggable: false
  });