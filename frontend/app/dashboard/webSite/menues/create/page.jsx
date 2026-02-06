"use client";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState({
    title: "",
    url: "",
    parentId: "",
    order: 0,
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/menus").then((res) => {
      setMenus(res.data.menus);
    });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    await axios.post("http://localhost:5000/api/menus", {
      ...form,
      parentId: form.parentId || null,
    });
    router.push("/dashboard/menus");
  };

  return (
    <Paper sx={{ maxWidth: 720, mx: "auto", p: 4 }}>
      <Typography variant="h6" mb={3}>
        ایجاد منوی جدید
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="عنوان منو"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
          required
        />

        <TextField
          label="لینک (اختیاری)"
          name="url"
          value={form.url}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          select
          label="منوی والد"
          name="parentId"
          value={form.parentId}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="">— بدون والد —</MenuItem>
          {menus.map((m) => (
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
            انصراف
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            ذخیره منو
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
