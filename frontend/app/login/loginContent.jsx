"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  Link,
  Alert,
  Snackbar,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function AuthLayout({ title, subtitle, children }) {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "end",
        bgcolor: "#f5f7fa",
      }}
    >
      <Box
        sx={{
          position: { xs: "relative", md: "absolute" },
          width: { xs: "100%", md: 450 },
          left: { xs: "0", md: "225px" },
          top: { xs: 0, md: "20%" },
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: 450,
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            marginTop: 4
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={1}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            {subtitle}
          </Typography>
          {children}
        </Paper>
      </Box>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: "calc(100% - 450px)",
          bgcolor: "#0a1a2f",
          color: "#fff",
          alignItems: "center",
          justifyContent: "center",
          p: 6,
        }}
      >
        <Box>
          <Box
            component="img"
            src="/images/logoEN.png"
            alt="Logo"
            sx={{ width: 400 }}
          />
          <Typography sx={{ opacity: 0.8, maxWidth: 620, textAlign: "center" }}>
            <span style={{ color: "orange" }}>وب‌بوست</span> مسیر رشد آنلاین از
            ساخت تا رشد
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function Content() {
  const router = useRouter();
  const [user, setUser] = React.useState();
  const mutation = useMutation({
    mutationFn: (data) =>
      axios.post("http://localhost:5000/api/auth/login", data).then((r) => r.data),
    onSuccess: (data) => {
      setSnackbar({
        open: true,
        message: data.message || "ورود با موفقیت انجام شد",
        severity: "success",
      });
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    },
    onError: (error) => {
      console.log(error)
      const message =
        error?.response?.data?.message || "خطا در ورود، لطفاً دوباره تلاش کنید";

      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    },
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    mutation.mutate({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <AuthLayout
        title="ورود به حساب کاربری"
      >
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="ایمیل"
            name="email"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="رمز عبور"
            name="password"
            type="password"
            margin="normal"
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, py: 1.4, borderRadius: 2 }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "ورود"
            )}
          </Button>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" align="center">
            حساب کاربری ندارید؟{" "}
            <Link href="/register" fontWeight="bold" sx={{ textDecoration: "none" }}>
              ثبت‌نام
            </Link>
          </Typography>
        </Box>
      </AuthLayout>
    </>
  );
}
