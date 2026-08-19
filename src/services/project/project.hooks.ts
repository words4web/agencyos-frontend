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

export const useGetProject = (projectId: string, enabled = true) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await projectService.getProjectById(projectId);
      return response.data?.data || null;
    },
    enabled: enabled && !!projectId,
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", variables?.projectId],
      });
    },
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      projectId: string;
      assetId: string;
      payload: Partial<AddAssetPayload>;
    }) => {
      return projectService.updateAsset(
        variables.projectId,
        variables.assetId,
        variables.payload,
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", variables?.projectId],
      });
    },
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { projectId: string; assetId: string }) => {
      return projectService.deleteAsset(variables.projectId, variables.assetId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", variables?.projectId],
      });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => {
      return projectService.deleteProject(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useConfirmAssetUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      projectId: string;
      payload: {
        fileId: string;
        name: string;
        mimeType: string;
        webViewLink: string;
        category: string;
      };
    }) => {
      return projectService.confirmAssetUpload(
        variables.projectId,
        variables.payload,
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", variables?.projectId],
      });
    },
  });
};
