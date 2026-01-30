"use client";
import React, { useState } from "react";
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Paper, 
  CircularProgress,
  Alert,
  Snackbar
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

const loginRequest = async ({ email, password }) => {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default function LoginPage() {
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      console.log("✅ Login success:", data);
      
      // نمایش پیغام موفقیت
      showMessage(data.message || "ورود موفقیت‌آمیز بود", "success");
      
      // ذخیره توکن اگر وجود دارد
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      // ذخیره اطلاعات کاربر
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      // ریدایرکت به صفحه اصلی بعد از 2 ثانیه
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    },
    onError: (error) => {
      console.error("❌ Login error:", error);
      
      // نمایش پیغام خطا
      const errorMessage = error.message || 
                          error.response?.data?.message || 
                          "خطا در ارتباط با سرور";
      showMessage(errorMessage, "error");
    },
  });

  const showMessage = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    const email = data.get("email");
    const password = data.get("password");

    if (!email || !password) {
      showMessage("لطفا ایمیل و رمز عبور را وارد کنید", "warning");
      return;
    }

    mutation.mutate({
      email: email.toString(),
      password: password.toString(),
    });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={4} sx={{ p: 4, width: "100%", borderRadius: 3 }}>
          <Typography component="h1" variant="h5" align="center" mb={3}>
            ورود به حساب کاربری
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="ایمیل"
              name="email"
              autoComplete="email"
              autoFocus
              disabled={mutation.isPending}
              error={mutation.isError}
              helperText={mutation.isError ? "ایمیل یا رمز عبور اشتباه است" : ""}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="رمز عبور"
              type="password"
              id="password"
              autoComplete="current-password"
              disabled={mutation.isPending}
              error={mutation.isError}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "ورود"
              )}
            </Button>

            
          </Box>
        </Paper>
      </Box>

      {/* Snackbar برای پیغام‌ها */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}