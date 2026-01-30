"use client";
import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Link,
  Divider,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  Phone,
  Badge,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// تابع API برای ثبت‌نام
const registerRequest = async (userData) => {
  const response = await axios.post(
    "http://localhost:5000/api/auth/register",
    userData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export default function page() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});

  // استفاده از React Query برای ثبت‌نام
  const mutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: (data) => {
      if (data.success) {
        // نمایش موفقیت
        setErrors({});
        
        // ریدایرکت به صفحه ورود بعد از 2 ثانیه
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setErrors({ submit: data.message });
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "خطا در ثبت‌نام. لطفاً مجدداً تلاش کنید.";
      setErrors({ submit: errorMessage });
    },
  });

  // اعتبارسنجی فرم
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "نام و نام خانوادگی الزامی است";
    }

    if (!formData.email.trim()) {
      newErrors.email = "ایمیل الزامی است";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "ایمیل معتبر وارد کنید";
    }

    if (!formData.password) {
      newErrors.password = "رمز عبور الزامی است";
    } else if (formData.password.length < 6) {
      newErrors.password = "رمز عبور باید حداقل 6 کاراکتر باشد";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "رمز عبور و تکرار آن مطابقت ندارند";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "لطفاً شرایط را بپذیرید";
    }

    return newErrors;
  };

  // تغییر مقدار فیلدها
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // پاک کردن خطای فیلد هنگام تایپ
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ارسال فرم
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // آماده‌سازی داده برای ارسال
    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      password: formData.password,
    };

    mutation.mutate(userData);
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            borderRadius: 4,
            overflow: "hidden",
            bgcolor: "background.paper",
          }}
        >
          {/* هدر */}
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              py: 3,
              px: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="h4" component="h1" fontWeight="bold">
              ثبت‌نام
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
              حساب کاربری جدید ایجاد کنید
            </Typography>
          </Box>

          {/* فرم */}
          <Box sx={{ p: { xs: 3, md: 5 } }}>
            {mutation.isSuccess && (
              <Alert
                severity="success"
                sx={{ mb: 3 }}
                action={
                  <Button color="inherit" size="small" href="/login">
                    ورود
                  </Button>
                }
              >
                ثبت‌نام موفقیت‌آمیز بود! در حال انتقال به صفحه ورود...
              </Alert>
            )}

            {errors.submit && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errors.submit}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                {/* نام و نام خانوادگی */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="نام و نام خانوادگی"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    disabled={mutation.isPending}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />
                </Grid>

                {/* ایمیل */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    type="email"
                    label="ایمیل"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    disabled={mutation.isPending}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />
                </Grid>

                {/* تلفن (اختیاری) */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="شماره تلفن (اختیاری)"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={mutation.isPending}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="action" />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    type={showPassword ? "text" : "password"}
                    label="رمز عبور"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password || "حداقل ۶ کاراکتر"}
                    disabled={mutation.isPending}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />
                </Grid>

                {/* تکرار رمز عبور */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    label="تکرار رمز عبور"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    disabled={mutation.isPending}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />
                </Grid>

                {/* شرایط استفاده */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        با{" "}
                        <Link href="/terms" color="primary">
                          شرایط استفاده
                        </Link>{" "}
                        و{" "}
                        <Link href="/privacy" color="primary">
                          حریم خصوصی
                        </Link>{" "}
                        موافقم
                      </Typography>
                    }
                  />
                  {errors.acceptTerms && (
                    <Typography color="error" variant="caption">
                      {errors.acceptTerms}
                    </Typography>
                  )}
                </Grid>

                {/* دکمه ثبت‌نام */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={mutation.isPending}
                    sx={{
                      py: 1.5,
                      fontSize: "1.1rem",
                      borderRadius: 2,
                      bgcolor: "primary.main",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    }}
                  >
                    {mutation.isPending ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "ایجاد حساب کاربری"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 4 }}>
              <Typography variant="body2" color="textSecondary">
                یا
              </Typography>
            </Divider>

            {/* دکمه‌های ورود با شبکه‌های اجتماعی */}
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                ثبت‌نام سریع با
              </Typography>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  startIcon={
                    <Box
                      component="span"
                      sx={{ color: "#DB4437", fontSize: "1.2rem" }}
                    >
                      G
                    </Box>
                  }
                  sx={{ borderRadius: 2 }}
                >
                  گوگل
                </Button>
                <Button
                  variant="outlined"
                  startIcon={
                    <Box
                      component="span"
                      sx={{ color: "#1877F2", fontSize: "1.2rem" }}
                    >
                      f
                    </Box>
                  }
                  sx={{ borderRadius: 2 }}
                >
                  فیسبوک
                </Button>
              </Box>
            </Box>

            {/* لینک ورود */}
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography variant="body2" color="textSecondary">
                قبلاً حساب کاربری دارید؟{" "}
                <Link
                  href="/login"
                  color="primary"
                  fontWeight="bold"
                  sx={{ textDecoration: "none" }}
                >
                  وارد شوید
                </Link>
              </Typography>
            </Box>
          </Box>

          {/* فوتر */}
          <Box
            sx={{
              bgcolor: "grey.50",
              py: 2,
              px: 4,
              textAlign: "center",
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="caption" color="textSecondary">
              با ثبت‌نام، شما موافقت می‌کنید که اطلاعات شما مطابق با{" "}
              <Link href="/privacy" color="primary" fontSize="inherit">
                سیاست حریم خصوصی
              </Link>{" "}
              ما ذخیره و پردازش شود.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}