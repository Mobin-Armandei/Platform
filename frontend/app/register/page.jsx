"use client";
// Login & Register layout inspired by ArvanCloud (modern, split, minimal)
// This file shows BOTH pages structure + shared styles. You can split later.

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
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";

/* -------------------- Shared Wrapper -------------------- */
function AuthLayout({ title, subtitle, children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "#f5f7fa",
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

/* -------------------- Register Page -------------------- */
export default function page() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data) =>
      axios
        .post("http://localhost:5000/api/auth/register", data)
        .then((r) => r.data),
    onSuccess: () => router.push("/login"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    mutation.mutate({
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <AuthLayout
      title="ایجاد حساب کاربری"
      subtitle="چند ثانیه تا شروع استفاده"
    >
      <Box component="form" onSubmit={handleSubmit}>
        <TextField fullWidth label="نام" name="name" margin="normal" />
        <TextField
          fullWidth
          label="ایمیل"
          name="email"
          margin="normal"
        />
        <TextField
          fullWidth
          label="رمز عبور"
          name="password"
          type="password"
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
          <Link href="/login" fontWeight="bold">
            ورود
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
}
