"use client";

import { PageHeader } from "@/components/PageHeader";
import { ConfirmModal } from "@/components/ConfirmModal";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { EEventType } from "@/enums";
import { useCalendar } from "@/hooks/useCalendar";

import { EventFormModal } from "./components/EventFormModal";
import { ViewEventModal } from "./components/ViewEventModal";
import { CalendarSidebar } from "./components/CalendarSidebar";

import { DAYS_OF_WEEK, MONTHS } from "@/data/calendar";
import { formatDateToYYYYMMDD } from "@/utils/date";
import { getEventClassNames } from "@/utils/event";

export default function CalendarPage() {
  const {
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
  } = useCalendar();

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col gap-6">
      <PageHeader
        title="Calendar"
        subtitle="Manage agency events, holidays, and deadlines"
        icon={CalendarIcon}
        action={
          isAdmin
            ? {
                label: "Add Event",
                icon: Plus,
                onClick: () => {
                  handleOpenAddModal(formatDateToYYYYMMDD(new Date()));
                },
              }
            : undefined
        }
      />

      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/30 border border-slate-850 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <ChevronRight size={16} />
          </button>
          <h2 className="text-lg font-bold text-slate-200 ml-2">
            {MONTHS[currentMonth]} {currentYear}
          </h2>
        </div>
        <button
          onClick={handleToday}
          className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
          Today
        </button>
      </div>

      <div className="rounded-2xl border border-slate-900 overflow-hidden bg-slate-950/60 shadow-xl">
        <div className="grid grid-cols-7 border-b border-slate-900 bg-slate-900/30">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-[120px] divide-x divide-y divide-slate-900">
          {calendarCells?.map(({ day, isCurrentMonth, dateString }, idx) => {
            const isToday = new Date().toDateString() === dateString;
            const items = calendarDataMap[dateString] || [];

            return (
              <div
                key={idx}
                onClick={() => setSelectedDayForSidebar(dateString)}
                className={`p-2 flex flex-col justify-between transition-colors relative group cursor-pointer hover:bg-slate-900/30 ${
                  isCurrentMonth
                    ? "bg-slate-900/10"
                    : "bg-slate-950/20 opacity-40"
                }`}>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                      isToday
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/30"
                        : "text-slate-400 group-hover:text-slate-200"
                    }`}>
                    {day}
                  </span>
                </div>

                <div className="flex-1 mt-1.5 flex flex-col gap-1 overflow-y-auto max-h-[85px] no-scrollbar">
                  {items?.map((item, itemIdx) => {
                    if (item?.type === "event") {
                      const isHoliday =
                        item?.event?.type === EEventType.HOLIDAY;
                      return (
                        <div
                          key={itemIdx}
                          className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium border truncate ${getEventClassNames(
                            item.event.type,
                          )}`}
                          title={item.event.title}>
                          <span
                            className={`w-1 h-1 rounded-full shrink-0 ${
                              isHoliday ? "bg-rose-400" : "bg-indigo-400"
                            }`}
                          />
                          <span className="truncate">{item.event.title}</span>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={itemIdx}
                          className="flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 border border-amber-500/20 text-amber-400 truncate"
                          title={`Due: ${item.ticket.title}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span className="truncate">{item.ticket.title}</span>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EventFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Event"
        defaultValues={addDefaultValues}
        onSubmit={handleAddSubmit}
        isPending={createEventMutation.isPending}
        employees={employees}
      />

      <EventFormModal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="Edit Event Details"
        defaultValues={editDefaultValues}
        onSubmit={handleEditSubmit}
        isPending={updateEventMutation.isPending}
        employees={employees}
      />

      <ViewEventModal
        isOpen={!!selectedViewEvent}
        onClose={() => setSelectedViewEvent(null)}
        selectedEvent={selectedViewEvent}
      />

      <ConfirmModal
        isOpen={!!eventToDelete}
        title="Delete Event"
        description="Are you sure you want to permanently delete this event? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleteEventMutation.isPending}
        onConfirm={handleDeleteSubmit}
        onClose={() => {
          setEventToDelete(null);
        }}
      />

      <CalendarSidebar
        selectedDay={selectedDayForSidebar}
        onClose={() => setSelectedDayForSidebar(null)}
        items={
          selectedDayForSidebar
            ? calendarDataMap[selectedDayForSidebar] || []
            : []
        }
        isAdmin={isAdmin}
        onAddEventClick={() => handleOpenAddModal(selectedDayForSidebar || "")}
        onViewEventClick={(ev) => setSelectedViewEvent(ev)}
        onEditEventClick={(ev) => handleOpenEditModal(ev)}
        onDeleteEventClick={(ev) => {
          setEventToDelete(ev);
        }}
      />
    </div>
  );
}
