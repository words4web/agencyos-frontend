import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useGetTickets } from "@/services/ticket/ticket.hooks";
import { useGetEmployees } from "@/services/employee/employee.hooks";
import {
  useGetEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from "@/services/event/event.hooks";
import { ICalendarEvent } from "@/types/event/event.types";
import { EUserRole } from "@/enums";
import { toast } from "sonner";
import { EventFormValues } from "@/schemas/event/event.schema";
import { EEventType } from "@/enums";

export function useCalendar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === EUserRole.ADMIN;

  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDayForSidebar, setSelectedDayForSidebar] = useState<
    string | null
  >(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addDateStr, setAddDateStr] = useState("");

  const [selectedEvent, setSelectedEvent] = useState<ICalendarEvent | null>(
    null,
  );
  const [selectedViewEvent, setSelectedViewEvent] =
    useState<ICalendarEvent | null>(null);

  const [eventToDelete, setEventToDelete] = useState<ICalendarEvent | null>(
    null,
  );

  const { data: events = [] } = useGetEvents();
  const { data: tickets = [] } = useGetTickets(
    isAdmin ? {} : { assigneeId: user?.id || "" },
  );
  const { data: employees = [] } = useGetEmployees(isAdmin);

  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const calendarCells = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const startDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const cells: Array<{
      day: number;
      date: Date;
      isCurrentMonth: boolean;
      dateString: string;
    }> = [];

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(currentYear, currentMonth - 1, day);
      cells.push({
        day,
        date,
        isCurrentMonth: false,
        dateString: date.toDateString(),
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      cells.push({
        day: i,
        date,
        isCurrentMonth: true,
        dateString: date.toDateString(),
      });
    }

    const totalSlots = 42;
    const remainingSlots = totalSlots - cells.length;
    for (let i = 1; i <= remainingSlots; i++) {
      const date = new Date(currentYear, currentMonth + 1, i);
      cells.push({
        day: i,
        date,
        isCurrentMonth: false,
        dateString: date.toDateString(),
      });
    }

    return cells;
  }, [currentMonth, currentYear]);

  const calendarDataMap = useMemo(() => {
    const map: Record<
      string,
      Array<
        | { type: "event"; event: ICalendarEvent }
        | { type: "ticket"; ticket: any }
      >
    > = {};

    events?.forEach((ev) => {
      const start = new Date(ev.startDate);
      const end = new Date(ev.endDate);
      const current = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
      );
      const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());

      while (current <= last) {
        const dateStr = current.toDateString();
        if (!map[dateStr]) map[dateStr] = [];
        map[dateStr].push({ type: "event", event: ev });
        current.setDate(current.getDate() + 1);
      }
    });

    tickets?.forEach((ticket) => {
      if (ticket.dueDate) {
        const dateStr = new Date(ticket.dueDate).toDateString();
        if (!map[dateStr]) map[dateStr] = [];
        map[dateStr].push({ type: "ticket", ticket });
      }
    });

    return map;
  }, [events, tickets]);

  const handleOpenAddModal = (dateStr: string) => {
    if (!isAdmin) return;
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    setAddDateStr(`${yyyy}-${mm}-${dd}`);
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (values: EventFormValues) => {
    const parseLocalToIso = (dateStr: string, timeStr: string) => {
      const [year, month, day] = dateStr?.split("-")?.map(Number);
      const [hours, minutes] = timeStr?.split(":")?.map(Number);
      return new Date(year, month - 1, day, hours, minutes)?.toISOString();
    };

    const startIso =
      values?.type === EEventType.HOLIDAY
        ? parseLocalToIso(values?.date, "00:00")
        : parseLocalToIso(values?.date, values?.time || "10:00");

    const endIso =
      values?.type === EEventType.HOLIDAY
        ? parseLocalToIso(values?.date, "23:59")
        : parseLocalToIso(values.date, values.time || "10:00");

    createEventMutation.mutate(
      {
        title: values.title,
        description: values.description,
        startDate: startIso,
        endDate: endIso,
        type: values.type,
        meetingLink:
          values.type === EEventType.MEETING ? values.meetingLink : undefined,
        participants:
          values.type === EEventType.MEETING ? values.participants : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Event created successfully");
          setIsAddModalOpen(false);
        },
        onError: () => {
          toast.error("Failed to create event");
        },
      },
    );
  };

  const handleOpenEditModal = (ev: ICalendarEvent) => {
    if (!isAdmin) return;
    setSelectedEvent(ev);
  };

  const handleEditSubmit = (values: EventFormValues) => {
    if (!selectedEvent) return;

    const parseLocalToIso = (dateStr: string, timeStr: string) => {
      const [year, month, day] = dateStr?.split("-")?.map(Number);
      const [hours, minutes] = timeStr?.split(":")?.map(Number);
      return new Date(year, month - 1, day, hours, minutes)?.toISOString();
    };

    const startIso =
      values?.type === EEventType.HOLIDAY
        ? parseLocalToIso(values?.date, "00:00")
        : parseLocalToIso(values?.date, values?.time || "10:00");

    const endIso =
      values?.type === EEventType.HOLIDAY
        ? parseLocalToIso(values?.date, "23:59")
        : parseLocalToIso(values?.date, values?.time || "10:00");

    updateEventMutation.mutate(
      {
        eventId: selectedEvent._id,
        payload: {
          title: values.title,
          description: values.description,
          startDate: startIso,
          endDate: endIso,
          type: values.type,
          meetingLink:
            values.type === EEventType.MEETING ? values.meetingLink : undefined,
          participants:
            values.type === EEventType.MEETING
              ? values.participants
              : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Event updated successfully");
          setSelectedEvent(null);
        },
        onError: () => {
          toast.error("Failed to update event");
        },
      },
    );
  };

  const handleDeleteSubmit = () => {
    if (!eventToDelete) return;

    deleteEventMutation.mutate(eventToDelete._id, {
      onSuccess: () => {
        toast.success("Event deleted successfully");
        setEventToDelete(null);
      },
      onError: () => {
        toast.error("Failed to delete event");
      },
    });
  };

  const addDefaultValues = useMemo(() => {
    return {
      title: "",
      description: "",
      type: EEventType.HOLIDAY,
      date: addDateStr,
      time: "10:00",
      meetingLink: "",
      participants: [],
    };
  }, [addDateStr]);

  const editDefaultValues = useMemo(() => {
    if (!selectedEvent) return {};
    const d = new Date(selectedEvent.startDate);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hour = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return {
      title: selectedEvent.title,
      description: selectedEvent.description || "",
      type: selectedEvent.type,
      date: `${yyyy}-${mm}-${dd}`,
      time: `${hour}:${min}`,
      meetingLink: selectedEvent.meetingLink || "",
      participants:
        selectedEvent.participants?.map((p: any) => p._id || p) || [],
    };
  }, [selectedEvent]);

  return {
    isAdmin,
    currentMonth,
    currentYear,
    isAddModalOpen,
    setIsAddModalOpen,
    selectedDayForSidebar,
    setSelectedDayForSidebar,
    selectedEvent,
    setSelectedEvent,
    selectedViewEvent,
    setSelectedViewEvent,
    eventToDelete,
    setEventToDelete,
    employees,
    calendarCells,
    calendarDataMap,
    createEventMutation,
    updateEventMutation,
    deleteEventMutation,
    handlePrevMonth,
    handleNextMonth,
    handleToday,
    handleOpenAddModal,
    handleAddSubmit,
    handleOpenEditModal,
    handleEditSubmit,
    handleDeleteSubmit,
    addDefaultValues,
    editDefaultValues,
  };
}
