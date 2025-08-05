import AppRoutes from "./routes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return <><AuthProvider><ToastContainer aria-label={undefined}/><AppRoutes /></AuthProvider></>;
}
