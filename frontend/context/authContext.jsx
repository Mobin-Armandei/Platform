"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showMessage = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const fetchUserById = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/auth/getUserInfo/${id}`
      );

      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      return res.data.user;
    } catch (error) {
      const message =
        error?.response?.data?.message || "خطا در دریافت اطلاعات کاربر";
      showMessage(message, "error");
      throw error;
    }
  };

  // ---------- Logout ----------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    showMessage("با موفقیت خارج شدید", "success");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        setUser,
        fetchUserById,
        logout,
      }}
    >
      {children}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={closeSnackbar}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
