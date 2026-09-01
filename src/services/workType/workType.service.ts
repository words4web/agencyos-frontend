import { axiosInstance } from "@/utils/axios";
import { API_ROUTES } from "@/constants/api";
import { IWorkType } from "@/types/workType/workType.types";

export const workTypeService = {
  getWorkTypes: async (includeInactive = false): Promise<IWorkType[]> => {
    const res = await axiosInstance.get<{ data: IWorkType[] }>(
      API_ROUTES.WORK_TYPES.BASE,
      {
        params: { includeInactive },
      },
    );
    return res?.data?.data;
  },

  getWorkTypeById: async (id: string): Promise<IWorkType> => {
    const res = await axiosInstance.get<{ data: IWorkType }>(
      API_ROUTES.WORK_TYPES.DETAIL(id),
    );
    return res?.data?.data;
  },

  createWorkType: async (payload: {
    name: string;
    description?: string;
    items: { label: string }[];
  }) => {
    const res = await axiosInstance.post<{ data: IWorkType; message?: string }>(
      API_ROUTES.WORK_TYPES.BASE,
      payload,
    );
    return res?.data;
  },

  updateWorkType: async (
    id: string,
    payload: {
      name?: string;
      description?: string;
      items?: { _id?: string; label: string }[];
      isActive?: boolean;
    },
  ) => {
    const res = await axiosInstance.put<{ data: IWorkType; message?: string }>(
      API_ROUTES.WORK_TYPES.DETAIL(id),
      payload,
    );
    return res?.data;
  },

  deleteWorkType: async (id: string) => {
    const res = await axiosInstance.delete<{
      data: IWorkType;
      message?: string;
    }>(API_ROUTES.WORK_TYPES.DETAIL(id));
    return res?.data;
  },
};
