import React from "react";
import { Modal } from "@/components/Modal";
import { EventForm } from "@/forms/event/EventForm";
import { EventFormModalProps } from "@/types/event/event.types";

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  title,
  defaultValues,
  onSubmit,
  isPending,
  employees,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <EventForm
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        isPending={isPending}
        employees={employees}
        onCancel={onClose}
      />
    </Modal>
  );
};
