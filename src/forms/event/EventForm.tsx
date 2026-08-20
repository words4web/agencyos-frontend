import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema, EventFormValues } from "@/schemas/event/event.schema";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { EventFormProps } from "@/types/event/event.types";
import { EEventType } from "@/enums";

export function EventForm({
  defaultValues,
  onSubmit,
  isPending,
  employees,
  onCancel,
}: EventFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: EEventType.HOLIDAY,
      date: "",
      time: "10:00",
      meetingLink: "",
      participants: [],
      ...defaultValues,
    },
  });

  useEffect(() => {
    reset({
      title: "",
      description: "",
      type: EEventType.HOLIDAY,
      date: "",
      time: "10:00",
      meetingLink: "",
      participants: [],
      ...defaultValues,
    });
  }, [defaultValues, reset]);

  const type = watch("type");
  const selectedParticipants = (watch("participants") || []) as string[];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        id="eventTitle"
        label="Event Title"
        placeholder="e.g. Company Holiday / Team Sync"
        {...register("title")}
        error={errors.title?.message}
        required
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-slate-300">
          Event Type
        </label>
        <select
          {...register("type")}
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm cursor-pointer">
          <option value={EEventType.HOLIDAY}>Holiday</option>
          <option value={EEventType.MEETING}>Meeting</option>
          <option value={EEventType.REMINDER} disabled>
            Reminder (Coming Soon)
          </option>
        </select>
        {errors.type && (
          <span className="text-xs text-red-400 mt-1">
            {errors.type.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-slate-300">
          Description
        </label>
        <textarea
          {...register("description")}
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
          rows={3}
          placeholder="Provide event details..."
        />
        {errors.description && (
          <span className="text-xs text-red-400 mt-1">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="eventDate"
          type="date"
          label="Event Date"
          {...register("date")}
          error={errors.date?.message}
          required
        />
        {type !== EEventType.HOLIDAY && (
          <Input
            id="eventTime"
            type="time"
            label="Event Time"
            {...register("time")}
            error={errors.time?.message}
            required
          />
        )}
      </div>

      {type === EEventType.MEETING && (
        <>
          <Input
            id="meetingLink"
            type="url"
            label="Event Link"
            placeholder="e.g. https://meet.google.com/abc-defg-hij"
            {...register("meetingLink")}
            error={errors.meetingLink?.message}
            required
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300">
              Select Participants
            </label>
            <div className="max-h-[150px] overflow-y-auto rounded-lg bg-slate-900 border border-slate-700 p-3 flex flex-col gap-2">
              {employees?.map((employee: any) => {
                const isChecked = selectedParticipants.includes(employee._id);
                return (
                  <label
                    key={employee._id}
                    className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        if (isChecked) {
                          setValue(
                            "participants",
                            selectedParticipants.filter(
                              (id) => id !== employee._id,
                            ),
                          );
                        } else {
                          setValue("participants", [
                            ...selectedParticipants,
                            employee._id,
                          ]);
                        }
                      }}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                    />
                    <span className="font-medium">{employee.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">
                      ({employee.role})
                    </span>
                  </label>
                );
              })}
              {employees?.length === 0 && (
                <span className="text-xs text-slate-500 italic">
                  No employees found.
                </span>
              )}
            </div>
            {errors.participants && (
              <span className="text-xs text-red-400 mt-1">
                {errors.participants.message}
              </span>
            )}
          </div>
        </>
      )}

      <div className="flex gap-3 justify-end mt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Event"}
        </Button>
      </div>
    </form>
  );
}
