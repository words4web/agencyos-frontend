import React from "react";
import { TicketComments } from "./TicketComments";
import { TicketCommentsTabProps } from "@/types/ticket/ticket.types";

export function TicketCommentsTab({
  ticket,
  onSubmitComment,
  isCommentsPending,
}: TicketCommentsTabProps) {
  return (
    <div className="animate-in fade-in duration-200">
      <TicketComments
        comments={ticket.comments}
        onSubmitComment={onSubmitComment}
        isPending={isCommentsPending}
      />
    </div>
  );
}
