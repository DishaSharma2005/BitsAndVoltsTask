import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />

      <ToastContainer position="top-right" autoClose={2000} />
    </BrowserRouter>
  );
}
