"use client";

import {
  Paper,
  Typography,
  Divider,
  Stack,
  Chip,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function MenuDetailsPage() {
  const { id } = useParams();
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/menus/${id}`)
      .then((res) => setMenu(res.data.menu));
  }, [id]);

  if (!menu) return <>در حال بارگذاری...</>;

  return (
    <Paper sx={{ maxWidth: 720, mx: "auto", p: 4 }}>
      <Typography variant="h6" mb={2}>
        جزئیات منو
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={2}>
        <Typography>
          <strong>عنوان:</strong> {menu.title}
        </Typography>

        <Typography>
          <strong>لینک:</strong> {menu.url || "—"}
        </Typography>

        <Typography>
          <strong>ترتیب:</strong> {menu.order}
        </Typography>

        <Typography>
          <strong>منوی والد:</strong>{" "}
          {menu.parent ? menu.parent.title : "ندارد"}
        </Typography>

        <Box>
          <Typography mb={1}>
            <strong>زیرمنوها:</strong>
          </Typography>

          {menu.subMenus.length === 0 ? (
            <Typography color="text.secondary">
              زیرمنویی وجود ندارد
            </Typography>
          ) : (
            menu.subMenus.map((sub) => (
              <Chip
                key={sub.id}
                label={sub.title}
                sx={{ mr: 1, mb: 1 }}
              />
            ))
          )}
        </Box>
      </Stack>
    </Paper>
  );
}
