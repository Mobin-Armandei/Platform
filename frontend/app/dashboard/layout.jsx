"use client";
import * as React from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Collapse,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { usePathname, useRouter } from "next/navigation";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LogoutIcon from "@mui/icons-material/Logout";
import MessageIcon from "@mui/icons-material/Message";
import SecurityIcon from "@mui/icons-material/Security";
import ArticleIcon from "@mui/icons-material/Article";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 280;

const menuItems = [
  { label: "داشبورد", icon: <DashboardIcon />, href: "/dashboard" },
  {
    label: "محتوا",
    icon: <ArticleIcon />,
    children: [
      { label: "مطالب سایت", href: "/content/articles" },
      { label: "دسته بندی مطالب", href: "/content/pages" },
    ],
  },
  {
    label: "وبسایت",
    icon: <ArticleIcon />,
    children: [
      { label: "اطلاعات اصلی", href: "/content/articles" },
      { label: "مدیریت صفحات", href: "/content/pages" },
    ],
  },
  {
    label: "تصاویر",
    icon: <ArticleIcon />,
    children: [
      { label: "گالری تصاویر", href: "/content/articles" },
      { label: "دسته بندی گالری تصاویر", href: "/content/pages" },
    ],
  },
  {
    label: "مالی",
    icon: <ArticleIcon />,
    children: [
      { label: "تراکنش ها", href: "/content/articles" },
      { label: "فاکتورها", href: "/content/pages" },
      { label: "شارژ حساب کاربر", href: "/content/pages" },
      { label: "کسر از حساب", href: "/content/pages" },
    ],
  },
  { label: "کیف پول", icon: <AccountBalanceWalletIcon />, href: "/wallet" },
  { label: "تیکت‌ها", icon: <MessageIcon />, href: "/tickets" },
  { label: "امنیت", icon: <SecurityIcon />, href: "/security" },
];

export default function DashboardLayout({ children }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openMenus, setOpenMenus] = React.useState({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();
  const router = useRouter();

  const handleToggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const drawerContent = (
    <Box sx={{ p: 2 }}>
      <Paper
        sx={{
          borderRadius: 3,
          height: "calc(100vh - 100px)",
          p: 1,
          overflow: "auto",
          scrollbarWidth: "none",
        }}
      >
        <List disablePadding>
          {menuItems.map((item) => {
            const isActive = item.href && pathname === item.href;
            const hasChildren = Boolean(item.children);

            return (
              <Box key={item.label}>
                <ListItemButton
                  onClick={() => {
                    if (item.href) router.push(item.href);
                    if (hasChildren) handleToggleMenu(item.label);
                  }}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    px: 1.5,
                    py: 1,
                    bgcolor: isActive ? "rgba(79,70,229,0.12)" : "transparent",
                    color: isActive ? "#4F46E5" : "inherit",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: isActive ? "#4F46E5" : "#2b59f1ff" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                  {hasChildren &&
                    (openMenus[item.label] ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>

                {hasChildren && (
                  <Collapse in={openMenus[item.label]} timeout="auto">
                    <List disablePadding>
                      {item.children.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <ListItemButton
                            key={child.href}
                            onClick={() => router.push(child.href)}
                            sx={{
                              pr: 5,
                              py: 0.75,
                              borderRadius: 2,
                              bgcolor: childActive
                                ? "rgba(79,70,229,0.12)"
                                : "transparent",
                              color: childActive ? "#4F46E5" : "inherit",
                            }}
                          >
                            <ListItemText primary={child.label} />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </List>
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F5F7FB" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "#fff",
          color: "#1F2937",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isMobile && (
              <IconButton>
                <MenuIcon />
              </IconButton>
            )}
            <Typography fontWeight={700}>داشبورد</Typography>
          </Box>

          <Box
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
          >
            <Avatar sx={{ bgcolor: "#4F46E5" }}>م</Avatar>
            <Typography>محمد رضایی</Typography>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem>کیف پول من</MenuItem>
            <Divider />
            <MenuItem sx={{ color: "#DC2626" }}>
              <LogoutIcon fontSize="small" sx={{ ml: 1 }} /> خروج
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open
        sx={{
          width: drawerWidth,
          overflow: "auto",
          scrollbarWidth: "none",
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            bgcolor: "transparent",
            border: "none",
          },
        }}
      >
        <Toolbar />
        {drawerContent}
      </Drawer>

      {/* Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          mt: 8,
        }}
      >
        <Paper sx={{ borderRadius: 3, p: 3, minHeight: "calc(100vh - 120px)" }}>
          {children}
        </Paper>
      </Box>
    </Box>
  );
}
