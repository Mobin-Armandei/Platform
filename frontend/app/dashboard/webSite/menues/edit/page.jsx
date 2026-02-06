"use client";

import {
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function page() {
  const { id } = useParams();
  const router = useRouter();
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/menus/${id}`).then((res) => {
      setForm(res.data.menu);
    });

    axios.get("http://localhost:5000/api/menus").then((res) => {
      setMenus(res.data.menus);
    });
  }, [id]);

  if (!form) return <>در حال بارگذاری...</>;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    await axios.put(`http://localhost:5000/api/menus/${id}`, {
      title: form.title,
      url: form.url,
      parentId: form.parentId,
      order: form.order,
    });
    router.push("/dashboard/menus");
  };

  return (
    <Paper sx={{ maxWidth: 720, mx: "auto", p: 4 }}>
      <Typography variant="h6" mb={3}>
        ویرایش منو
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="عنوان منو"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="لینک"
          name="url"
          value={form.url || ""}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          select
          label="منوی والد"
          name="parentId"
          value={form.parentId || ""}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="">— بدون والد —</MenuItem>
          {menus
            .filter((m) => m.id !== form.id)
            .map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.title}
              </MenuItem>
            ))}
        </TextField>

        <TextField
          label="ترتیب نمایش"
          name="order"
          type="number"
          value={form.order}
          onChange={handleChange}
          fullWidth
        />

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={() => router.back()}>
            بازگشت
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            ذخیره تغییرات
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
