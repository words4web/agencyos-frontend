import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService } from "./event.service";
import {
  CreateEventPayload,
  UpdateEventPayload,
} from "@/types/event/event.types";

export const useGetEvents = (enabled = true) => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await eventService.getEvents();
      return response.data?.data || [];
    },
    enabled,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEventPayload) => {
      return eventService.createEvent(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      eventId: string;
      payload: UpdateEventPayload;
    }) => {
      return eventService.updateEvent(variables.eventId, variables.payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => {
      return eventService.deleteEvent(eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
