import { EUserRole } from "@/enums";

export interface IEmployee {
  _id: string;
  name: string;
  email: string;
  designation: string;
  role?: EUserRole;
  isActive?: boolean;
}

export interface CreateEmployeePayload {
  name: string;
  email: string;
  password?: string;
  designation: string;
}

export interface CreateEmployeeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export interface EmployeeTableProps {
  employees: IEmployee[];
}
