import { useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { TicketCommentsProps } from "@/types/ticket/ticket.types";
import { AddCommentForm } from "@/forms/ticket/AddCommentForm";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { formatTicketDate } from "@/utils/ticket";

export function TicketComments({
  comments,
  onSubmitComment,
  isPending,
}: TicketCommentsProps) {
  const { user } = useSelector((state: RootState) => state?.auth);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [comments?.length]);

  return (
    <div className="border-t border-slate-800 pt-6">
      <h5 className="text-sm uppercase font-bold text-slate-500 tracking-wider mb-4 flex items-center gap-1.5">
        <MessageSquare size={14} className="text-indigo-400" />
        Comments ({comments?.length || 0})
      </h5>

      <div
        ref={scrollContainerRef}
        className="flex flex-col gap-4 max-h-72 overflow-y-auto mb-4 pr-1.5 custom-scrollbar">
        {comments?.length === 0 ? (
          <span className="text-sm text-slate-500 italic block py-4 text-center">
            No comments posted yet. Start the conversation!
          </span>
        ) : (
          comments?.map((c, idx) => {
            const isCurrentUser = c.user?._id === user?.id;
            return (
              <div
                key={idx}
                className={`flex flex-col max-w-[85%] ${
                  isCurrentUser
                    ? "self-end items-end"
                    : "self-start items-start"
                }`}>
                <div className="flex items-center gap-1.5 text-xs mb-1 px-1">
                  <span className="font-semibold text-slate-400">
                    {isCurrentUser ? "You" : c.user?.name}
                  </span>
                  <span className="text-[10px] bg-slate-900 border border-slate-800/80 px-1 py-0.2 rounded text-slate-500 font-bold uppercase tracking-wider">
                    {c.user?.designation}
                  </span>
                </div>

                <div
                  className={`p-3 rounded-2xl border leading-relaxed shadow-sm transition-all ${
                    isCurrentUser
                      ? "rounded-tr-none bg-indigo-950/20 border-indigo-900/60 text-slate-100"
                      : "rounded-tl-none bg-slate-900/40 border-slate-800 text-slate-200"
                  }`}>
                  <p className="text-sm whitespace-pre-line break-words">
                    {c?.content}
                  </p>
                </div>

                <span className="text-[10px] text-slate-500 mt-1 px-1">
                  {formatTicketDate(c?.createdAt, {
                    withTime: true,
                    withYear: false,
                  })}
                </span>
              </div>
            );
          })
        )}
      </div>

      <AddCommentForm onSubmit={onSubmitComment} isPending={isPending} />
    </div>
  );
}
