"use client";

import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  Tooltip,
  Button,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchPosts = async () => {
  const res = await axios.get("http://localhost:5000/api/post/list", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return Array.isArray(res.data.data) ? res.data.data : [];
};

export default function PostContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(
        `http://localhost:5000/api/post/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      return res.data;
    },
    onSuccess: (data) => {
      setSnackbar({
        open: true,
        message: data.message,
        severity: "success",
      });
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "خطا در حذف",
        severity: "error",
      });
    },
  });

  const handleDelete = (id) => {
    deletePostMutation.mutate(id);
  };
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }
  if (isError) {
    return <Typography color="error">خطا در دریافت مطالب</Typography>;
  }
  return (
    <Box>
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
      <Typography variant="h5" fontWeight="bold" mb={3}>
        لیست مطالب
      </Typography>

      <Grid container sx={{ justifyContent: "end", marginBottom: "12px" }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push("/dashboard/content/post/create")}
        >
          جدید
        </Button>
      </Grid>

      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table>
          <TableHead sx={{ background: "rgba(0, 0, 0, 0.04)" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 900 }} align="center">
                ردیف
              </TableCell>
              <TableCell sx={{ fontWeight: 900 }} align="center">
                عنوان
              </TableCell>
              <TableCell sx={{ fontWeight: 900 }} align="center">
                دسته‌بندی
              </TableCell>
              <TableCell sx={{ fontWeight: 900 }} align="center">
                وضعیت
              </TableCell>
              <TableCell sx={{ fontWeight: 900 }} align="center">
                تاریخ انتشار
              </TableCell>
              <TableCell sx={{ fontWeight: 900 }} align="center">
                عملیات
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  مطلبی یافت نشد
                </TableCell>
              </TableRow>
            ) : (
              posts?.map((post, index) => (
                <TableRow key={post.id} hover>
                  <TableCell sx={{ fontWeight: 500 }} align="center">
                    {index + 1}
                  </TableCell>

                  <TableCell sx={{ fontWeight: 500 }} align="center">
                    {post.title}
                  </TableCell>

                  <TableCell align="center">
                    {post.category?.title || "—"}
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      size="small"
                      label={post.published ? "منتشر شده" : "پیش‌نویس"}
                      sx={{
                        background: post.published ? "#4f46e5" : "default",
                        color: post.published ? "#fff" : "#000",
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("fa-IR")
                      : "—"}
                  </TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="مشاهده">
                        <IconButton color="info">
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="ویرایش">
                        <IconButton
                          color="success"
                          onClick={() =>
                            router.push(
                              `/dashboard/content/post/edit/${post.id}`,
                            )
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="حذف">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(post.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}

            {/* {posts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  مطلبی یافت نشد
                </TableCell>
              </TableRow>
            )} */}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
