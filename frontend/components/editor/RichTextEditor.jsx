"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";

import { Box, IconButton, Divider } from "@mui/material";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CodeIcon from "@mui/icons-material/Code";
import ImageIcon from "@mui/icons-material/Image";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import TitleIcon from "@mui/icons-material/Title";

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link,
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const uploadImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const token = localStorage.getItem("token");
      const file = input.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("http://localhost:5000/api/upload/image", {
        headers: { Authorization: "Bearer " + token },
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      editor.chain().focus().setImage({ src: data.url }).run();
    };
  };

  return (
    <Box>
      {/* Toolbar */}
      <Box
        sx={{
          border: "1px solid #ddd",
          p: 1,
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <IconButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <TitleIcon />
        </IconButton>

        <IconButton onClick={() => editor.chain().focus().toggleBold().run()}>
          <FormatBoldIcon />
        </IconButton>

        <IconButton onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FormatItalicIcon />
        </IconButton>

        <IconButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <FormatUnderlinedIcon />
        </IconButton>

        <IconButton onClick={() => editor.chain().focus().toggleStrike().run()}>
          <StrikethroughSIcon />
        </IconButton>

        <Divider orientation="vertical" flexItem />

        <IconButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FormatListBulletedIcon />
        </IconButton>

        <IconButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FormatListNumberedIcon />
        </IconButton>

        <IconButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <FormatQuoteIcon />
        </IconButton>

        <IconButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <CodeIcon />
        </IconButton>

        <Divider orientation="vertical" flexItem />

        <IconButton onClick={uploadImage}>
          <ImageIcon />
        </IconButton>

        <IconButton onClick={() => editor.chain().focus().undo().run()}>
          <UndoIcon />
        </IconButton>

        <IconButton onClick={() => editor.chain().focus().redo().run()}>
          <RedoIcon />
        </IconButton>
      </Box>

      {/* Editor */}
      <Box sx={{ border: "1px solid #ddd", minHeight: 250, p: 2 }}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
