import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className = "", id, ...props }: Props) {
  const inputId = id ?? props.name;
  const err = error?.trim();
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        aria-invalid={err ? true : undefined}
        className={`h-11 w-full rounded-xl border bg-white px-3 text-gray-900 shadow-sm placeholder:text-gray-400 transition focus:outline-none focus:ring-2 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 ${
          err
            ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/25 dark:border-rose-500"
            : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-gray-700"
        } ${className}`}
        {...props}
      />
      {err ? <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{err}</p> : null}
    </div>
  );
}
