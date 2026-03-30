"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
};

export function CommentInput({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder = "Write a comment…",
}: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="h-10 min-h-[2.5rem] w-full flex-1 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
        autoComplete="off"
        aria-label="Comment"
      />
      <Button type="submit" disabled={disabled || !value.trim()} className="w-full shrink-0 sm:w-auto">
        Send
      </Button>
    </motion.form>
  );
}
