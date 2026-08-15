import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ITicket, UpdateTicketPayload } from "@/types/ticket/ticket.types";
import { EUserRole } from "@/enums";
import {
  useGetTickets,
  useCreateTicket,
  useUpdateTicket,
  useAddComment,
  useDeleteTicket,
} from "@/services/ticket/ticket.hooks";
import { useGetProjects } from "@/services/project/project.hooks";
import { useGetEmployees } from "@/services/employee/employee.hooks";
import {
  CreateTicketFormValues,
  AddCommentFormValues,
} from "@/schemas/ticket/ticket.schema";

export function useKanban() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === EUserRole.ADMIN;

  const [filterProject, setFilterProject] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  const { data: tickets = [], isLoading: isLoadingTickets } = useGetTickets({
    projectId: filterProject,
    assigneeId: filterAssignee,
    priority: filterPriority,
  });
  const { data: projects = [] } = useGetProjects();
  const { data: employees = [] } = useGetEmployees(isAdmin);

  const createTicketMutation = useCreateTicket();
  const updateTicketMutation = useUpdateTicket();
  const addCommentMutation = useAddComment();
  const deleteTicketMutation = useDeleteTicket();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createError, setCreateError] = useState("");

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const selectedTicket = selectedTicketId
    ? tickets?.find((t) => t?._id === selectedTicketId) || null
    : null;

  const searchParams = useSearchParams();
  const ticketIdParam = searchParams.get("ticketId");

  useEffect(() => {
    if (ticketIdParam && tickets?.length > 0) {
      const match = tickets?.find((t) => t?._id === ticketIdParam);
      if (match) {
        setTimeout(() => {
          setSelectedTicketId(match?._id);
        }, 0);
      }
    }
  }, [ticketIdParam, tickets]);

  const handleCreateTicket = (values: CreateTicketFormValues) => {
    setCreateError("");
    const payload = {
      ...values,
      tags: values.tags
        ? values.tags
            ?.split(",")
            ?.map((t) => t?.trim())
            ?.filter(Boolean)
        : [],
    };
    createTicketMutation.mutate(payload, {
      onSuccess: () => setIsCreateOpen(false),
      onError: (err: unknown) => {
        const error = err as { response?: { data?: { message?: string } } };
        setCreateError(
          error.response?.data?.message || "Failed to create ticket",
        );
      },
    });
  };

  const handleUpdateTicket = (
    ticketId: string,
    payload: UpdateTicketPayload,
  ) => {
    updateTicketMutation.mutate(
      { ticketId, payload },
      {
        onSuccess: (response) => {
          const updated = response.data?.data;
          if (updated && selectedTicketId === ticketId) {
            setSelectedTicketId(null);
          }
          toast.success("Ticket updated successfully!");
        },
        onError: (err: any) => {
          const errorMsg =
            err?.response?.data?.message ||
            "Failed to update ticket. Please try again.";
          toast.error(errorMsg);
        },
      },
    );
  };

  const handleAddComment = (values: AddCommentFormValues) => {
    if (!selectedTicket) return;
    addCommentMutation.mutate({
      ticketId: selectedTicket._id,
      payload: { content: values.content },
    });
  };

  const handleDeleteTicket = (ticketId: string) => {
    deleteTicketMutation.mutate(ticketId, {
      onSuccess: () => {
        if (selectedTicketId === ticketId) {
          setSelectedTicketId(null);
        }
        toast.success("Ticket deleted successfully!");
      },
      onError: (err: any) => {
        const errorMsg =
          err?.response?.data?.message ||
          "Failed to delete ticket. Please try again.";
        toast.error(errorMsg);
      },
    });
  };

  const handleCloseDetails = () => {
    setSelectedTicketId(null);
    router.replace("/kanban");
  };

  const clearFilters = () => {
    setFilterProject("");
    setFilterAssignee("");
    setFilterPriority("");
  };

  return {
    isAdmin,
    filterProject,
    setFilterProject,
    filterAssignee,
    setFilterAssignee,
    filterPriority,
    setFilterPriority,
    tickets,
    projects,
    employees,
    isCreateOpen,
    setIsCreateOpen,
    createError,
    selectedTicket,
    setSelectedTicket: (ticket: ITicket | null) =>
      setSelectedTicketId(ticket ? ticket._id : null),
    handleCloseDetails,
    handleCreateTicket,
    handleUpdateTicket,
    handleDeleteTicket,
    handleAddComment,
    clearFilters,
    isCreatingTicket: createTicketMutation.isPending,
    isCommentsPending: addCommentMutation.isPending,
    isDeletingTicket: deleteTicketMutation.isPending,
    isUpdatingTicket: updateTicketMutation.isPending,
    isLoadingTickets,
  };
}
