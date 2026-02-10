"use client";

import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Switch,
  FormControlLabel,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import RichTextEditor from "@/components/editor/RichTextEditor";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";

const fetchCategories = async () => {
  const res = await axios.get("http://localhost:5000/api/category/list", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data.categories;
};

const createPost = async (form) => {
  const res = await axios.post("http://localhost:5000/api/post/create", form, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
};

export default function CreatePostContent() {
  const router = useRouter();
  const [content, setContent] = useState("");

  const [form, setForm] = useState({
    title: "",
    foreword: "",
    content: "",
    categoryId: "",
    tags: "",
    published: false,
  });

  /* ------------------ Categories Query ------------------ */
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 دقیقه cache
  });

  /* ------------------ Create Post Mutation ------------------ */
  const { mutate, isLoading: submitLoading } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      router.push("/dashboard/content/post");
    },
    onError: () => {
      alert("خطا در ایجاد پست");
    },
  });

  const handleSubmit = () => {
    mutate({
      ...form,
      content,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .join(","),
    });
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        ایجاد پست جدید
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: "none" }}>
        <Stack spacing={3}>
          <TextField
            label="عنوان پست"
            fullWidth
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <TextField
            label="پیش‌مطلب"
            fullWidth
            multiline
            rows={3}
            value={form.foreword}
            onChange={(e) => setForm({ ...form, foreword: e.target.value })}
          />

          <Box>
            <Typography mb={1}>محتوا</Typography>
            <RichTextEditor value={content} onChange={setContent} />
          </Box>

          {/* Category Select */}
          <TextField
            select
            label="دسته‌بندی"
            fullWidth
            disabled={categoriesLoading}
            value={form.categoryId}
            onChange={(e) =>
              setForm({ ...form, categoryId: Number(e.target.value) })
            }
          >
            {categoriesLoading && (
              <MenuItem disabled>
                <CircularProgress size={20} />
              </MenuItem>
            )}

            {categoriesError && (
              <MenuItem disabled>خطا در دریافت دسته‌بندی</MenuItem>
            )}

            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.title}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="تگ‌ها (با , جدا کن)"
            fullWidth
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
              />
            }
            label="انتشار شود"
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => router.back()}>
              انصراف
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitLoading}
            >
              {submitLoading ? "در حال ذخیره..." : "ذخیره پست"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
