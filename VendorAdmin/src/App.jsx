import Hero from "./pages/Hero/Hero";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import VendorRegistrationForm from "./pages/Registration/Registration";
import LoginForm from "./pages/Login/Login";
import Dashboard from "./pages/DashBoard/Dashboard";

function App() {
  return (
    <div className="text-black whiteSoftBG">
      {/* <Header /> */}
      <Routes>
        {/* <Route path="/" element={<Hero />} /> */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<VendorRegistrationForm />} />
      </Routes>
    </div>
  );
}

export default App;
