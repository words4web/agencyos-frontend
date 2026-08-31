import React, { ReactNode } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: "primary" | "danger";
  onConfirm: () => void;
  onClose: () => void;
}

export interface CommonLoaderProps {
  fullScreen?: boolean;
  message?: string;
}

export interface CommonErrorProps {
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
  compact?: boolean;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  action?: {
    label: string;
    icon?: React.ComponentType<{ className?: string; size?: number }>;
    onClick: () => void;
  };
}
export interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
}

export interface ActionMenuItem<T> {
  label: string;
  onClick: (row: T) => void;
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  actions?: ActionMenuItem<T>[];
  onRowClick?: (row: T) => void;
}
