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
  Snackbar,
  Divider
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/authContext";

function AuthLayout({ title, subtitle, children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "#f5f7fa",
        textAlign: "center"
      }}
    >
      {/* Right branding panel (hidden on mobile) */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: "45%",
          bgcolor: "#0a1a2f",
          color: "#fff",
          alignItems: "center",
          justifyContent: "center",
          p: 6,
        }}
      >
        <Box>
          <Typography variant="h3" fontWeight="bold" mb={2}>
            Arvan Style
          </Typography>
          <Typography sx={{ opacity: 0.8, maxWidth: 360 }}>
            زیرساخت ابری، سریع، امن و قابل اعتماد برای توسعه‌دهندگان حرفه‌ای
          </Typography>
        </Box>
      </Box>

      {/* Form panel */}
      <Box
        sx={{
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
            width: "100%",
            maxWidth: 420,
            p: 4,
            borderRadius: 3,
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
    </Box>
  );
}

/* -------------------- Login Page -------------------- */
export default function page() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
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
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "خطا در ورود، لطفاً دوباره تلاش کنید";

      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    },
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
        title="ورود به پنل کاربری"
        subtitle="برای ادامه وارد حساب خود شوید"
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
            <Link href="/register" fontWeight="bold">
              ثبت‌نام
            </Link>
          </Typography>
        </Box>
      </AuthLayout>
    </>
  );
}