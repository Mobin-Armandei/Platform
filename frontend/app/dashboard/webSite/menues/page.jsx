"use client";

import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function page() {
  const [menus, setMenus] = useState([]);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/menus")
      .then((res) => setMenus(res.data.menus))
      .catch(console.error);
  }, []);

  const renderSubMenus = (subs, level = 1) =>
    subs.map((menu) => (
      <TableRow key={menu.id}>
        <TableCell sx={{ pl: level * 4 }}>
          └ {menu.title}
        </TableCell>
        <TableCell>{menu.url || "-"}</TableCell>
        <TableCell>
          <Chip size="small" label={`سطح ${level + 1}`} />
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={() => router.push(`/dashboard/menus/${menu.id}`)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
    ));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        مدیریت منوها
      </Typography>

      {menus.length === 0 ? (
        <Typography color="text.secondary">
          هنوز هیچ منویی ایجاد نشده است.
        </Typography>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell>عنوان</TableCell>
                <TableCell>لینک</TableCell>
                <TableCell>سطح</TableCell>
                <TableCell align="right">عملیات</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {menus.map((menu) => (
                <>
                  <TableRow key={menu.id}>
                    <TableCell>
                      <strong>{menu.title}</strong>
                    </TableCell>
                    <TableCell>{menu.url || "-"}</TableCell>
                    <TableCell>
                      <Chip size="small" label="اصلی" color="primary" />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() =>
                          router.push(`/dashboard/menus/${menu.id}`)
                        }
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {menu.subMenus?.length > 0 &&
                    renderSubMenus(menu.subMenus)}
                </>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Paper>
  );
}
