import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "./project.service";
import {
  CreateProjectPayload,
  UpdateProjectPayload,
  AssignEmployeesPayload,
  AddAssetPayload,
  ConfirmAssetUploadPayload,
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

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      projectId: string;
      payload: UpdateProjectPayload;
    }) => {
      return projectService.updateProject(
        variables.projectId,
        variables.payload,
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", variables?.projectId],
      });
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
    onSuccess: (response, variables) => {
      const updated = response.data?.data;
      if (updated) {
        queryClient.setQueryData(["project", variables?.projectId], updated);
      }
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
    onSuccess: (response, variables) => {
      const updated = response.data?.data;
      if (updated) {
        queryClient.setQueryData(["project", variables?.projectId], updated);
      }
    },
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { projectId: string; assetId: string }) => {
      return projectService.deleteAsset(variables.projectId, variables.assetId);
    },
    onSuccess: (response, variables) => {
      const updated = response.data?.data;
      if (updated) {
        queryClient.setQueryData(["project", variables?.projectId], updated);
      }
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
      payload: ConfirmAssetUploadPayload;
    }) => {
      return projectService.confirmAssetUpload(
        variables.projectId,
        variables.payload,
      );
    },
    onSuccess: (response, variables) => {
      const updated = response.data?.data;
      if (updated) {
        queryClient.setQueryData(["project", variables?.projectId], updated);
      }
    },
  });
};

export const useConfirmBatchAssetUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      projectId: string;
      payload: ConfirmAssetUploadPayload[];
    }) => {
      return projectService.confirmBatchAssetUpload(
        variables.projectId,
        variables.payload,
      );
    },
    onSuccess: (response, variables) => {
      const updated = response.data?.data;
      if (updated) {
        queryClient.setQueryData(["project", variables?.projectId], updated);
      }
    },
  });
};

export const useCreateSubFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      projectId: string;
      parentFolderId: string | null;
      name: string;
    }) => {
      return projectService.createSubFolder(
        variables.projectId,
        variables.parentFolderId,
        variables.name,
      );
    },
    onSuccess: (response, variables) => {
      const updated = response.data?.data;
      if (updated) {
        queryClient.setQueryData(["project", variables?.projectId], updated);
      }
    },
  });
};

export const useRenameFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      projectId: string;
      assetId: string;
      name: string;
    }) => {
      return projectService.renameFolder(
        variables.projectId,
        variables.assetId,
        variables.name,
      );
    },
    onSuccess: (response, variables) => {
      const updated = response.data?.data;
      if (updated) {
        queryClient.setQueryData(["project", variables?.projectId], updated);
      }
    },
  });
};
