import { ELeaveType, EUserRole } from "@/enums";

export interface IUserMinInfo {
  _id: string;
  name: string;
  email: string;
  designation?: string;
  role?: EUserRole;
}

export interface ILeave {
  _id: string;
  employee: string | IUserMinInfo;
  leaveType: ELeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  isHalfDay: boolean;
  reason: string;
  status: "pending" | "approved" | "rejected";
  lateNotice: boolean;
  isAuthorized: boolean;
  adminNote?: string;
  approvedBy?: string | IUserMinInfo;
  approvedAt?: string;
  createdByAdmin: boolean;
  calendarEventId?: string;
  createdAt: string;
  updatedAt: string;
}

export type LeaveFormValues = {
  employeeId?: string;
  leaveType: ELeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  isHalfDay: boolean;
  lateNotice: boolean;
  isAuthorized: boolean;
  adminNote: string;
};

export interface UseLeaveFormProps {
  isAdmin: boolean;
  selectedEmployeeId?: string;
  myBalance?: { remaining: number } | null;
  allBalances?: ILeaveBalance[];
  onSubmit: (values: LeaveFormValues) => void;
}

export interface ILeaveBalance {
  _id: string;
  employee: string | IUserMinInfo;
  year: number;
  totalAllowed: number;
  used: number;
  remaining: number;
}

export interface LeaveFormProps {
  isAdmin: boolean;
  employees?: IUserMinInfo[];
  myBalance?: { remaining: number } | null;
  allBalances?: ILeaveBalance[];
  onSubmit: (values: LeaveFormValues) => void;
  isPending: boolean;
  onCancel: () => void;
}

export interface LeaveActionModalContentProps {
  selectedLeave: ILeave | null;
  actionType: "approve" | "reject" | null;
  onClose: () => void;
  onSubmit: (flags: {
    lateNotice?: boolean;
    isAuthorized?: boolean;
    adminNote: string;
  }) => void;
  isPending: boolean;
}
