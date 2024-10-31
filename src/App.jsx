import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./Admin/Dashboard";
import "./App.css";
import TypesComponent from "./Admin/TypesComponent";
import AddElementComponent from "./Admin/AddElementComponent";
import Home from "./User/Home";
import EditPanel from "./Admin/EditPanel";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadToken } from "./Redux/authSlice";
import AdminSignup from "./Admin/AdminSignup";
import AdminVerifyAccount from "./Admin/AdminOtpVerifier";
import AdminLogin from "./Admin/AdminLogin";
import ShapeDisplay from "./Admin/ShapeDisplay";
import AssetManagement from "./Admin/AssetsManagement";
import Assets from "./Admin/Assets";
import Signup from "./User/UserSignup";
import Login from "./User/UserLogin";
import Projects from "./User/Projects";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  useEffect(() => {
    dispatch(loadToken());
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/shape" element={<ShapeDisplay />} />
          <Route
            path="/home"
            element={
              isAuthenticated && !isAdmin ? (
                <Home />
              ) : isAuthenticated && isAdmin ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/"
            element={
              !isAdmin && isAuthenticated ? (
                <Projects />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/signup"
            element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
          />

          <Route
            path="/admin"
            element={isAdmin ? <Dashboard /> : <Navigate to="/admin-signup" />}
          />
          <Route path="/assets" element={<Assets />} />
          <Route path="/element-types" element={<TypesComponent />} />
          <Route path="/add-element" element={<AddElementComponent />} />
          <Route path="/edit-element" element={<EditPanel />} />

          <Route
            path="/admin-signup"
            element={!isAuthenticated ? <AdminSignup /> : <Navigate to="/" />}
          />
          <Route
            path="/admin-verify/:email"
            element={
              !isAuthenticated ? <AdminVerifyAccount /> : <Navigate to="/" />
            }
          />
          <Route
            path="/admin-login"
            element={!isAuthenticated ? <AdminLogin /> : <Navigate to="/" />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
