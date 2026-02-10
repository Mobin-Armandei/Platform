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
  InputAdornment,
  IconButton,
  Alert,
  MenuItem,
  Snackbar,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

/* -------------------- Shared Wrapper -------------------- */
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
      {/* Form panel */}
      <Box
        sx={{
          position: { xs: "relative", md: "absolute" },
          width: { xs: "100%", md: 450 },
          left: { xs: "0", md: "225px" },
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
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  const mutation = useMutation({
    mutationFn: (data) =>
      axios
        .post("http://localhost:5000/api/auth/register", data)
        .then((r) => r.data),
    onSuccess: (data) => {
      setSnackbar({
        open: true,
        message: data.message,
        severity: "success",
      });
      setTimeout(() => {
        router.push("/login");
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
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    mutation.mutate({
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      birthDate: data.get("birthDate"),
      phoneNumber: data.get("phoneNumber"),
      gender: data.get("gender"),
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
        title="ایجاد حساب کاربری"
        // subtitle="بساز، منتشر کن، رشد بده"
      >
        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth label="نام" name="firstName" margin="normal" />
          <TextField
            fullWidth
            label="نام خانوادگی"
            name="lastName"
            margin="normal"
          />
          <TextField
            fullWidth
            label="شماره همراه"
            name="phoneNumber"
            margin="normal"
            type="tel"
          />
          <TextField
            fullWidth
            label="ایمیل"
            name="email"
            margin="normal"
            type="email"
          />
          <TextField
            fullWidth
            label="تاریخ تولد"
            name="birthDate"
            margin="normal"
            type="date"
          />
          <TextField
            fullWidth
            name="gender"
            select
            label="جنسیت"
            margin="normal"
            defaultValue="مرد"
          >
            <MenuItem key="Male" value="Male">
              مرد
            </MenuItem>
            <MenuItem key="FEMALE" value="FEMALE">
              زن
            </MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="رمز عبور"
            name="password"
            type="password"
            // endAdornment={
            //   <InputAdornment position="end">
            //     <IconButton
            //       aria-label={
            //         showPassword ? 'hide the password' : 'display the password'
            //       }
            //       onClick={handleClickShowPassword}
            //       onMouseDown={handleMouseDownPassword}
            //       onMouseUp={handleMouseUpPassword}
            //       edge="end"
            //     >
            //       {showPassword ? <VisibilityOff /> : <Visibility />}
            //     </IconButton>
            //   </InputAdornment>
            // }
            margin="normal"
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
              "ثبت‌نام"
            )}
          </Button>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" align="center">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link href="/login" fontWeight="bold" sx={{ textDecoration: "none" }}>
              ورود
            </Link>
          </Typography>
        </Box>
      </AuthLayout>
    </>
  );
}
