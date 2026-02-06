"use client";

import * as React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  LinearProgress,
  Stack,
  Divider,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import MessageIcon from "@mui/icons-material/Message";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// -----------------------------
// Reusable Stat Card
// -----------------------------
function StatCard({ title, value, icon, color }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        height: "100%",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          sx={{
            bgcolor: color,
            width: 48,
            height: 48,
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function page() {
  return (
    <Box>
      {/* Page Title */}
      <Typography variant="h5" fontWeight={800} mb={3}>
        داشبورد مدیریتی
      </Typography>

      {/* Top Stats */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={12} md={6}>
          <StatCard
            title="موجودی کیف پول"
            value="12,500,000 تومان"
            icon={<AccountBalanceWalletIcon />}
            color="#4F46E5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <StatCard
            title="پروژه‌های فعال"
            value="4 پروژه"
            icon={<DashboardIcon />}
            color="#059669"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <StatCard
            title="کل محتواها"
            value="128 آیتم"
            icon={<ArticleIcon />}
            color="#0284C7"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <StatCard
            title="تیکت‌های باز"
            value="2 پیام"
            icon={<MessageIcon />}
            color="#DC2626"
          />
        </Grid>
      </Grid>

      {/* Main Section */}
      <Grid container spacing={3}>
        {/* Projects Progress */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #E5E7EB",
              height: "100%",
            }}
          >
            <Typography fontWeight={700} mb={2}>
              وضعیت پروژه‌ها
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">سایت فروشگاهی</Typography>
                  <Typography variant="body2">70%</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={70}
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">سایت شرکتی</Typography>
                  <Typography variant="body2">40%</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={40}
                  color="success"
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">لندینگ پیج</Typography>
                  <Typography variant="body2">90%</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={90}
                  color="secondary"
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Activity */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #E5E7EB",
              height: "100%",
            }}
          >
            <Typography fontWeight={700} mb={2}>
              فعالیت‌های اخیر
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  شارژ کیف پول
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  2 ساعت پیش
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  ایجاد پروژه جدید
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  دیروز
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  پاسخ به تیکت پشتیبانی
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  3 روز پیش
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Growth */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid #E5E7EB",
          mt: 3,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "#16A34A" }}>
            <TrendingUpIcon />
          </Avatar>
          <Box>
            <Typography fontWeight={700}>رشد حساب شما</Typography>
            <Typography variant="body2" color="text.secondary">
              فعالیت شما در این ماه نسبت به ماه قبل 23٪ افزایش داشته است.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
