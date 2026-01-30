"use client";

import React, { createContext, useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Snackbar, Alert } from "@mui/material";

// Context برای اطلاعات کاربر
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const getUserInfo = async ({ id }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/getUserInfo/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const mutation = useMutation(getUserInfo, {
    onSuccess: (data) => {
      console.log("✅ User info fetched:", data);
      if (data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      showMessage(data.message || "اطلاعات کاربر دریافت شد", "success");
    },
    onError: (error) => {
      console.error("❌ Fetch error:", error);
      const errorMessage = error.message || error.response?.data?.message || "خطا در ارتباط با سرور";
      showMessage(errorMessage, "error");
    },
  });

  const showMessage = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <AuthContext.Provider value={{ user, mutation }}>
      {children}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  );
};

// Hook برای استفاده راحت از Context
export const useAuth = () => useContext(AuthContext);
