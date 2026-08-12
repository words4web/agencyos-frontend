import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketService } from "./ticket.service";
import {
  CreateTicketPayload,
  UpdateTicketPayload,
  AddCommentPayload,
} from "@/types/ticket/ticket.types";

export const useGetTickets = (
  params?: { projectId?: string; assigneeId?: string; priority?: string },
  enabled = true,
) => {
  return useQuery({
    queryKey: ["tickets", params],
    queryFn: async () => {
      const response = await ticketService.getTickets(params);
      return response.data?.data || [];
    },
    enabled,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTicketPayload) => {
      return ticketService.createTicket(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      ticketId: string;
      payload: UpdateTicketPayload;
    }) => {
      return ticketService.updateTicket(
        variables?.ticketId,
        variables?.payload,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      ticketId: string;
      payload: AddCommentPayload;
    }) => {
      return ticketService.addComment(variables.ticketId, variables.payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};
