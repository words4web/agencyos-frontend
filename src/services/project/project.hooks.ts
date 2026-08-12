import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "./project.service";
import {
  CreateProjectPayload,
  AssignEmployeesPayload,
  AddAssetPayload,
} from "@/types/project/project.types";

export const useGetProjects = (enabled = true) => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await projectService.getProjects();
      return response.data?.data || [];
    },
    enabled,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => {
      return projectService.createProject(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useAssignEmployees = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      projectId: string;
      payload: AssignEmployeesPayload;
    }) => {
      return projectService.assignEmployees(
        variables.projectId,
        variables.payload,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useAddAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      projectId: string;
      payload: AddAssetPayload;
    }) => {
      return projectService.addAsset(variables.projectId, variables.payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
