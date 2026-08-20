import { axiosInstance } from "@/utils/axios";
import { API_ROUTES } from "@/constants/api";
import { AxiosResponse } from "axios";
import {
  ICalendarEvent,
  CreateEventPayload,
  UpdateEventPayload,
} from "@/types/event/event.types";

interface ResponseData<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const eventService = {
  getEvents: async (): Promise<
    AxiosResponse<ResponseData<ICalendarEvent[]>>
  > => {
    return axiosInstance.get(API_ROUTES.EVENTS.BASE);
  },

  createEvent: async (
    payload: CreateEventPayload,
  ): Promise<AxiosResponse<ResponseData<ICalendarEvent>>> => {
    return axiosInstance.post(API_ROUTES.EVENTS.BASE, payload);
  },

  updateEvent: async (
    eventId: string,
    payload: UpdateEventPayload,
  ): Promise<AxiosResponse<ResponseData<ICalendarEvent>>> => {
    return axiosInstance.patch(`${API_ROUTES.EVENTS.BASE}/${eventId}`, payload);
  },

  deleteEvent: async (
    eventId: string,
  ): Promise<AxiosResponse<ResponseData<ICalendarEvent>>> => {
    return axiosInstance.delete(`${API_ROUTES.EVENTS.BASE}/${eventId}`);
  },
};
