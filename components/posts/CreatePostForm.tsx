"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

type Props = {
  onSubmit: (data: { content: string; image: string | null }) => void;
  onCancel?: () => void;
  disabled?: boolean;
};

export function CreatePostForm({ onSubmit, onCancel, disabled }: Props) {
  const [content, setContent] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const clearImage = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setImageData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [previewUrl]);

  const processFile = useCallback(
    (file: File | undefined) => {
      if (!file || !file.type.startsWith("image/")) return;

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") setImageData(reader.result);
      };
      reader.readAsDataURL(file);
    },
    [previewUrl]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    const text = content.trim();
    if (!text && !imageData) return;
    onSubmit({ content: text, image: imageData });
    setContent("");
    clearImage();
  };

  const canPublish = !!(content.trim() || imageData) && !disabled;

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Textarea
        label="What’s on your mind?"
        placeholder="Write your post…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
      />

      <div className="space-y-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Photo (optional)</span>

        <button
          type="button"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (disabled) return;
            processFile(e.dataTransfer.files?.[0]);
          }}
          className={`group relative flex w-full min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 ${
            isDragging
              ? "scale-[1.01] border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/10"
              : "border-gray-300 bg-gray-50/80 hover:border-indigo-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800/40 dark:hover:border-indigo-500/50"
          } disabled:pointer-events-none disabled:opacity-50`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-600/15 text-indigo-600 transition group-hover:scale-105 dark:text-indigo-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
          </span>
          <p className="mt-3 text-sm font-medium text-gray-800 dark:text-gray-200">
            Drag & drop an image, or <span className="text-indigo-600 underline decoration-2 underline-offset-2 dark:text-indigo-400">browse</span>
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to a reasonable size</p>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="sr-only"
          aria-hidden
        />

        <AnimatePresence mode="popLayout">
          {previewUrl ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-2 overflow-hidden rounded-2xl border border-gray-200/90 bg-gray-100 shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="relative aspect-video max-h-80 w-full">
                <Image src={previewUrl} alt="Upload preview" fill className="object-contain" unoptimized />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-3 top-3 bg-white/95 shadow-sm dark:bg-gray-900/95"
                onClick={(e) => {
                  e.stopPropagation();
                  clearImage();
                }}
              >
                Remove
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-3 pt-1">
        <Button type="submit" disabled={!canPublish}>
          Publish
        </Button>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
