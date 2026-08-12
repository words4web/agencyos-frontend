"use client";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { Plus, Users } from "lucide-react";
import { useGetEmployees } from "@/services/employee/employee.hooks";
import { CreateEmployeeForm } from "@/forms/employee/CreateEmployeeForm";
import { EmployeeTable } from "@/components/employee/EmployeeTable";
import { PageHeader } from "@/components/PageHeader";

export default function EmployeesPage() {
  const { data: employees = [] } = useGetEmployees();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Employee Management"
          subtitle="Create and manage your agency staff"
          icon={Users}
          action={{
            label: "Add Employee",
            icon: Plus,
            onClick: () => setIsModalOpen(true),
          }}
        />

        <EmployeeTable employees={employees} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Employee">
        <CreateEmployeeForm
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}
