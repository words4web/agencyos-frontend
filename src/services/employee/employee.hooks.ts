import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeService } from "./employee.service";
import { CreateEmployeePayload } from "@/types/employee/employee.types";

export const useGetEmployees = (enabled = true) => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await employeeService.getEmployees();
      return response.data?.data || [];
    },
    enabled,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => {
      return employeeService.createEmployee(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};
