"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export type InputState = "default" | "error" | "success";
export type InputSize = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  state?: InputState;
  size?: InputSize;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const stateStyles: Record<InputState, string> = {
  default: `
    border-[var(--color-border-primary)]
    focus:border-[var(--color-brand)]
    focus:ring-1 focus:ring-[var(--color-brand)]
  `,
  error: `
    border-[var(--color-red)]
    focus:border-[var(--color-red)]
    focus:ring-1 focus:ring-[var(--color-red)]
  `,
  success: `
    border-[var(--color-green)]
    focus:border-[var(--color-green)]
    focus:ring-1 focus:ring-[var(--color-green)]
  `,
};

const sizeStyles: Record<InputSize, string> = {
  sm: "h-8 px-3 text-sm rounded-[var(--radius-md)]",
  md: "h-10 px-4 text-sm rounded-[var(--radius-lg)]",
  lg: "h-12 px-4 text-base rounded-[var(--radius-lg)]",
};

const iconSizeStyles: Record<InputSize, string> = {
  sm: "pl-8",
  md: "pl-10",
  lg: "pl-12",
};

const rightIconSizeStyles: Record<InputSize, string> = {
  sm: "pr-8",
  md: "pr-10",
  lg: "pr-12",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      state = "default",
      size = "md",
      label,
      helperText,
      errorMessage,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const currentState = errorMessage ? "error" : state;

    const baseStyles = `
      bg-[var(--color-bg-secondary)]
      text-[var(--color-text-primary)]
      placeholder:text-[var(--color-text-tertiary)]
      border
      transition-all duration-150 ease-out
      outline-none
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    return (
      <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-text-secondary)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`
              ${baseStyles}
              ${stateStyles[currentState]}
              ${sizeStyles[size]}
              ${leftIcon ? iconSizeStyles[size] : ""}
              ${rightIcon ? rightIconSizeStyles[size] : ""}
              ${fullWidth ? "w-full" : ""}
              ${className}
            `.trim()}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
              {rightIcon}
            </span>
          )}
        </div>
        {errorMessage && (
          <span className="text-xs text-[var(--color-red)]">{errorMessage}</span>
        )}
        {helperText && !errorMessage && (
          <span className="text-xs text-[var(--color-text-tertiary)]">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
