import { axiosInstance } from "@/utils/axios";
import { API_ROUTES } from "@/constants/api";
import { AxiosResponse } from "axios";
import {
  ITicket,
  CreateTicketPayload,
  UpdateTicketPayload,
  AddCommentPayload,
} from "@/types/ticket/ticket.types";

export const ticketService = {
  getTickets: async (params?: {
    projectId?: string;
    assigneeId?: string;
    priority?: string;
  }): Promise<AxiosResponse<{ success: boolean; data: ITicket[] }>> => {
    return axiosInstance.get(API_ROUTES.TICKETS.BASE, { params });
  },

  createTicket: async (
    payload: CreateTicketPayload,
  ): Promise<AxiosResponse<{ success: boolean; data: ITicket }>> => {
    return axiosInstance.post(API_ROUTES.TICKETS.BASE, payload);
  },

  updateTicket: async (
    ticketId: string,
    payload: UpdateTicketPayload,
  ): Promise<AxiosResponse<{ success: boolean; data: ITicket }>> => {
    return axiosInstance.put(API_ROUTES.TICKETS.DETAIL(ticketId), payload);
  },

  addComment: async (
    ticketId: string,
    payload: AddCommentPayload,
  ): Promise<AxiosResponse<{ success: boolean; data: ITicket }>> => {
    return axiosInstance.post(API_ROUTES.TICKETS.COMMENTS(ticketId), payload);
  },

  deleteTicket: async (
    ticketId: string,
  ): Promise<AxiosResponse<{ success: boolean; data: ITicket }>> => {
    return axiosInstance.delete(API_ROUTES.TICKETS.DETAIL(ticketId));
  },
};
