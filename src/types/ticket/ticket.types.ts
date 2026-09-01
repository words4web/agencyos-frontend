import { ReactNode } from "react";
import { IEmployee } from "../employee/employee.types";
import { IProject } from "../project/project.types";
import { ETicketStatus, ETicketPriority } from "@/enums";
import {
  CreateTicketFormValues,
  AddCommentFormValues,
} from "@/schemas/ticket/ticket.schema";
import { IWorkType } from "../workType/workType.types";

export interface IChecklistItem {
  _id?: string;
  label: string;
  isCompleted: boolean;
}

export interface IComment {
  _id?: string;
  user: {
    _id: string;
    name: string;
    role: string;
    designation: string;
  };
  content: string;
  createdAt: string;
}

export interface ITicket {
  _id: string;
  title: string;
  description: string;
  project: IProject;
  assignee: IEmployee;
  workType?: IWorkType;
  checklist?: IChecklistItem[];
  status: ETicketStatus;
  priority: ETicketPriority;
  comments: IComment[];
  dueDate?: string;
  storyPoints?: number;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  startDate?: string;
  isLocked?: boolean;
  requiresReview?: boolean;
  missedDeadlineCount?: number;
  waivedDeadlineCount?: number;
  revisionCount?: number;
  isDeleted?: boolean;
  createdAt: string;
}

export interface CreateTicketPayload {
  title: string;
  description?: string;
  project: string;
  assignee: string;
  workType?: string;
  checklist?: IChecklistItem[];
  status: ETicketStatus;
  priority: ETicketPriority;
  dueDate?: string;
  storyPoints?: number;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  startDate?: string;
  requiresReview?: boolean;
}

export interface UpdateTicketPayload {
  title?: string;
  description?: string;
  project?: string;
  assignee?: string;
  workType?: string;
  checklist?: IChecklistItem[];
  status?: ETicketStatus;
  priority?: ETicketPriority;
  dueDate?: string;
  storyPoints?: number;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  startDate?: string;
  requiresReview?: boolean;
}

export interface UpdateTicketStatusPayload {
  status: ETicketStatus;
}

export interface UnlockTicketPayload {
  newDueDate: string;
  waivePenalty: boolean;
}

export interface AddCommentPayload {
  content: string;
}

export interface CreateTicketFormProps {
  projects: IProject[];
  employees: IEmployee[];
  onSubmit: (values: CreateTicketFormValues) => void;
  onCancel: () => void;
  serverError?: string;
  isPending?: boolean;
}

export interface AddCommentFormProps {
  onSubmit: (values: AddCommentFormValues) => void;
  isPending?: boolean;
}

export interface KanbanFiltersProps {
  filterProject: string;
  setFilterProject: (value: string) => void;
  filterAssignee: string;
  setFilterAssignee: (value: string) => void;
  filterPriority: string;
  setFilterPriority: (value: string) => void;
  projects: IProject[];
  employees: IEmployee[];
  clearFilters: () => void;
}

export interface TicketCommentsProps {
  comments: IComment[];
  onSubmitComment: (values: AddCommentFormValues) => void;
  isPending?: boolean;
}

export interface KanbanBoardProps {
  tickets: ITicket[];
  onTicketClick: (ticket: ITicket) => void;
}

export interface UnlockTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: (newDueDate: string, waivePenalty: boolean) => void;
  isUnlocking?: boolean;
}

export interface TicketReviewBannerProps {
  isAdmin: boolean;
  isUpdating: boolean;
  onRequestRevision: () => void;
  onApprove: () => void;
}

export interface TicketDetailModalProps {
  ticket: ITicket | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTicket: (ticketId: string, payload: UpdateTicketPayload) => void;
  onDeleteTicket?: (ticketId: string) => void;
  onSubmitComment: (values: AddCommentFormValues) => void;
  employees: IEmployee[];
  projects: IProject[];
  isCommentsPending?: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export interface TicketTimelineEstimationProps {
  ticket: ITicket;
  formatDate: (dateStr?: string, options?: FormatTicketDateOptions) => string;
  canEdit: boolean;
  localStartDate: string;
  setLocalStartDate: (val: string) => void;
  localDueDate: string;
  setLocalDueDate: (val: string) => void;
  localStoryPoints: string;
  setLocalStoryPoints: (val: string) => void;
  localEstimatedHours: string;
  setLocalEstimatedHours: (val: string) => void;
}

export interface GetTimelineItemsParams {
  ticket: ITicket;
  formatDate: (dateStr?: string, options?: any) => string;
  localStartDate: string;
  setLocalStartDate: (val: string) => void;
  localDueDate: string;
  setLocalDueDate: (val: string) => void;
  localStoryPoints: string;
  setLocalStoryPoints: (val: string) => void;
  localEstimatedHours: string;
  setLocalEstimatedHours: (val: string) => void;
  inputClass: string;
}

export interface TicketLoggingProgressProps {
  ticket: ITicket;
  localStatus: ETicketStatus;
  setLocalStatus: (status: ETicketStatus) => void;
  localActualHours: number;
  setLocalActualHours: (hours: number) => void;
  canEdit: boolean;
  isAdmin?: boolean;
}

export interface FormatTicketDateOptions {
  withTime?: boolean;
  withYear?: boolean;
  fallback?: string;
}

export interface TicketPropertiesProps {
  ticket: ITicket;
  employees?: IEmployee[];
  projects?: IProject[];
  workTypes?: IWorkType[];
  canEditAssignee?: boolean;
  canEditProject?: boolean;
  canEditPriority?: boolean;
  canEditWorkType?: boolean;
  canEditRequiresReview?: boolean;
  localAssigneeId?: string;
  localProjectId?: string;
  localPriority?: ETicketPriority;
  localWorkTypeId?: string;
  localRequiresReview?: boolean;
  onUpdateAssignee?: (assigneeId: string) => void;
  onUpdateProject?: (projectId: string) => void;
  onUpdatePriority?: (priority: ETicketPriority) => void;
  onUpdateWorkType?: (workTypeId: string) => void;
  onUpdateRequiresReview?: (requiresReview: boolean) => void;
}

export interface TimelineCardProps {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value: ReactNode;
  tooltip?: string;
}

export interface TicketInfoTabProps {
  ticket: ITicket;
  employees: IEmployee[];
  projects: IProject[];
  isAdmin: boolean;
  canEdit: boolean;
  formState: {
    status: any;
    actualHours: number;
    assigneeId: string;
    projectId: string;
    priority?: ETicketPriority;
    workTypeId?: string;
    checklist?: IChecklistItem[];
    description: string;
    title: string;
    requiresReview?: boolean;
    startDate: string;
    dueDate: string;
    storyPoints: string;
    estimatedHours: string;
  };
  setFormValue: (key: any, value: any) => void;
}

export interface TicketCommentsTabProps {
  ticket: ITicket;
  onSubmitComment: (values: AddCommentFormValues) => void;
  isCommentsPending?: boolean;
}
