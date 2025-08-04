import AppRoutes from "./routes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return <><ToastContainer aria-label={undefined} /><AppRoutes /></>;
}