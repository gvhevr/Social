"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
};

export function MessageInput({
  value,
  onChange,
  onSend,
  disabled,
  placeholder = "Message…",
}: Props) {
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend();
  };

  return (
    <motion.form
      initial={false}
      onSubmit={submit}
      className="flex gap-2 border-t border-gray-200/90 bg-white/95 p-3 dark:border-gray-800 dark:bg-gray-950/95"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="h-11 min-h-[2.75rem] flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
        autoComplete="off"
        aria-label="Message text"
      />
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button type="submit" disabled={disabled || !value.trim()}>
          Send
        </Button>
      </motion.div>
    </motion.form>
  );
}
