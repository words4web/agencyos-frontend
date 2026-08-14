import { ReactNode } from "react";
import { IEmployee } from "../employee/employee.types";
import { IProject } from "../project/project.types";
import { ETicketStatus, ETicketPriority } from "@/enums";
import {
  CreateTicketFormValues,
  AddCommentFormValues,
} from "@/schemas/ticket/ticket.schema";

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
  status: ETicketStatus;
  priority: ETicketPriority;
  comments: IComment[];
  dueDate?: string;
  storyPoints?: number;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  startDate?: string;
  isDeleted?: boolean;
  createdAt: string;
}

export interface CreateTicketPayload {
  title: string;
  description?: string;
  project: string;
  assignee: string;
  status: ETicketStatus;
  priority: ETicketPriority;
  dueDate?: string;
  storyPoints?: number;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  startDate?: string;
}

export interface UpdateTicketPayload {
  title?: string;
  description?: string;
  project?: string;
  assignee?: string;
  status?: ETicketStatus;
  priority?: ETicketPriority;
  dueDate?: string;
  storyPoints?: number;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  startDate?: string;
}

export interface UpdateTicketStatusPayload {
  status: ETicketStatus;
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

export interface TicketDetailModalProps {
  ticket: ITicket | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTicket: (ticketId: string, payload: UpdateTicketPayload) => void;
  onDeleteTicket?: (ticketId: string) => void;
  onSubmitComment: (values: AddCommentFormValues) => void;
  employees: IEmployee[];
  isCommentsPending?: boolean;
  isDeleting?: boolean;
}

export interface TicketTimelineEstimationProps {
  ticket: ITicket;
  formatDate: (dateStr?: string) => string;
}

export interface TicketLoggingProgressProps {
  ticket: ITicket;
  localStatus: ETicketStatus;
  setLocalStatus: (status: ETicketStatus) => void;
  localActualHours: number;
  setLocalActualHours: (hours: number) => void;
  canEdit: boolean;
}

export interface FormatTicketDateOptions {
  withTime?: boolean;
  withYear?: boolean;
  fallback?: string;
}

export interface TicketPropertiesProps {
  ticket: ITicket;
  employees?: IEmployee[];
  canEditAssignee?: boolean;
  localAssigneeId?: string;
  onUpdateAssignee?: (assigneeId: string) => void;
}

export interface TimelineCardProps {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value: ReactNode;
  tooltip?: string;
}
