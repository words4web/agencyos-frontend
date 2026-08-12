import React from "react";
import { Button } from "@/components/Button";
import { PageHeaderProps } from "@/types/common/common.types";
import { NotificationCenter } from "@/components/notification/NotificationCenter";
import { Menu } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSidebarOpen } from "@/store/notificationSlice";

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  action,
}) => {
  const dispatch = useDispatch();
  const ActionIcon = action?.icon;

  return (
    <div className="flex items-center justify-between mb-8 gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(setSidebarOpen(true))}
          className="p-2 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200 md:hidden transition-colors">
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            {Icon && (
              <Icon className="text-indigo-500 hidden sm:inline" size={24} />
            )}
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NotificationCenter />
        {action && (
          <Button onClick={action.onClick} className="flex items-center gap-2">
            {ActionIcon && <ActionIcon size={18} />}
            {action?.label}
          </Button>
        )}
      </div>
    </div>
  );
};
