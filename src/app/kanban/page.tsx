"use client";

import { useKanban } from "@/hooks/useKanban";
import { Modal } from "@/components/Modal";
import { PageHeader } from "@/components/PageHeader";
import { FolderKanban, Plus } from "lucide-react";
import { CreateTicketForm } from "@/forms/ticket/CreateTicketForm";
import { KanbanFilters } from "@/components/ticket/KanbanFilters";
import { KanbanBoard } from "@/components/ticket/KanbanBoard";
import { TicketDetailModal } from "@/components/ticket/TicketDetailModal";
import { KanbanBoardSkeleton } from "@/components/skeleton/KanbanBoardSkeleton";

export default function KanbanPage() {
  const {
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
    setSelectedTicket,
    handleCloseDetails,
    handleCreateTicket,
    handleUpdateTicket,
    handleDeleteTicket,
    handleAddComment,
    clearFilters,
    isCreatingTicket,
    isCommentsPending,
    isDeletingTicket,
    isUpdatingTicket,
    isLoadingTickets,
  } = useKanban();

  return (
    <>
      <div className="px-8 pt-8">
        <PageHeader
          title="Agency Kanban"
          subtitle="Task board with connected projects"
          icon={FolderKanban}
          action={
            isAdmin
              ? {
                  label: "New Ticket",
                  icon: Plus,
                  onClick: () => setIsCreateOpen(true),
                }
              : undefined
          }
        />
      </div>

      <KanbanFilters
        filterProject={filterProject}
        setFilterProject={setFilterProject}
        filterAssignee={filterAssignee}
        setFilterAssignee={setFilterAssignee}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        projects={projects}
        employees={employees}
        clearFilters={clearFilters}
      />

      {isLoadingTickets ? (
        <KanbanBoardSkeleton />
      ) : (
        <KanbanBoard tickets={tickets} onTicketClick={setSelectedTicket} />
      )}

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        size="max-w-2xl"
        title="Create New Ticket">
        <CreateTicketForm
          projects={projects}
          employees={employees}
          onSubmit={handleCreateTicket}
          onCancel={() => setIsCreateOpen(false)}
          serverError={createError}
          isPending={isCreatingTicket}
        />
      </Modal>

      <TicketDetailModal
        key={selectedTicket?._id || "none"}
        ticket={selectedTicket}
        isOpen={!!selectedTicket}
        onClose={handleCloseDetails}
        onUpdateTicket={handleUpdateTicket}
        onDeleteTicket={handleDeleteTicket}
        onSubmitComment={handleAddComment}
        employees={employees}
        projects={projects}
        isCommentsPending={isCommentsPending}
        isDeleting={isDeletingTicket}
        isUpdating={isUpdatingTicket}
      />
    </>
  );
}
