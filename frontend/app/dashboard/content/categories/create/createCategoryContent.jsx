"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function CreateCategoryContent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [parent, setParent] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* ------------------ GET categories ------------------ */
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/category/list");
      return res.data.categories;
    },
  });

  /* ------------------ CREATE category ------------------ */
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/category/create", data);
      return res.data;
    },
    onSuccess: (data) => {
      setSnackbar({
        open: true,
        message: data.message,
        severity: "success",
      });
      setTitle("");
      setDescription("");
      setParent("");
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "خطا در ایجاد گروه مطلب",
        severity: "error",
      });
    },
  });

  const submitHandler = (e) => {
    e.preventDefault();

    createMutation.mutate({
      title,
      description,
      parent: parent || null,
    });
  };

  return (
    <>
      {/* Snackbar */}
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

      {/* Form */}
      <Box maxWidth={500} p={3}>
        <Typography variant="h6" mb={3}>
          ایجاد گروه مطلب
        </Typography>

        <Box component="form" onSubmit={submitHandler} display="grid" gap={2}>
          <TextField
            label="عنوان"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="توضیح"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            required
            fullWidth
          />

          <TextField
            select
            label="گروه والد (اختیاری)"
            value={parent}
            onChange={(e) => setParent(e.target.value)}
            fullWidth
          >
            <MenuItem value="">— بدون والد —</MenuItem>

            {isLoading ? (
              <MenuItem disabled>در حال بارگذاری...</MenuItem>
            ) : (
              categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.title}
                </MenuItem>
              ))
            )}
          </TextField>

          <Button
            type="submit"
            variant="contained"
            disabled={createMutation.isLoading}
          >
            {createMutation.isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "ایجاد گروه"
            )}
          </Button>
        </Box>
      </Box>
    </>
  );
}
