import { EEventType } from "@/enums";
import { EventFormValues } from "@/schemas/event/event.schema";

export interface ICalendarEvent {
  _id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: EEventType;
  meetingLink?: string;
  participants?: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
  }>;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventPayload {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type?: EEventType;
  meetingLink?: string;
  participants?: string[];
}

export interface UpdateEventPayload {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  type?: EEventType;
  meetingLink?: string;
  participants?: string[];
}

export interface EventFormProps {
  defaultValues: Partial<EventFormValues>;
  onSubmit: (values: EventFormValues) => void;
  isPending: boolean;
  employees: any[];
  onCancel: () => void;
}

export interface ViewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: ICalendarEvent | null;
}

export interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  defaultValues: Partial<EventFormValues>;
  onSubmit: (values: EventFormValues) => void;
  isPending: boolean;
  employees: any[];
}

export interface CalendarSidebarProps {
  selectedDay: string | null;
  onClose: () => void;
  items: Array<
    { type: "event"; event: ICalendarEvent } | { type: "ticket"; ticket: any }
  >;
  isAdmin: boolean;
  onAddEventClick: () => void;
  onViewEventClick: (event: ICalendarEvent) => void;
  onEditEventClick: (event: ICalendarEvent) => void;
  onDeleteEventClick: (event: ICalendarEvent) => void;
}

export interface SidebarEventCardProps {
  event: ICalendarEvent;
  isAdmin: boolean;
  onViewEventClick: (event: ICalendarEvent) => void;
  onEditEventClick: (event: ICalendarEvent) => void;
  onDeleteEventClick: (event: ICalendarEvent) => void;
}

export interface SidebarTicketCardProps {
  ticket: any;
}
