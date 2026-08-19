import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addCommentSchema,
  AddCommentFormValues,
} from "@/schemas/ticket/ticket.schema";
import { Button } from "@/components/Button";
import { AddCommentFormProps } from "@/types/ticket/ticket.types";

export function AddCommentForm({ onSubmit, isPending }: AddCommentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCommentFormValues>({
    resolver: zodResolver(addCommentSchema),
    defaultValues: { content: "" },
  });

  const handleFormSubmit = (values: AddCommentFormValues) => {
    onSubmit(values);
    reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(handleFormSubmit)();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col">
      <div className="flex flex-col rounded-xl bg-slate-900 border border-slate-800 focus-within:border-indigo-500/80 p-2.5 gap-2 transition-all">
        <textarea
          placeholder="Post an update..."
          {...register("content")}
          onKeyDown={handleKeyDown}
          rows={2}
          className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none resize-none min-h-[50px] leading-relaxed"
        />
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/40">
          <div>
            {errors.content && (
              <span className="text-[11px] text-red-400">
                {errors.content.message}
              </span>
            )}
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="text-xs py-1.5 px-3.5 bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm">
            {isPending ? "Sending..." : "Comment"}
          </Button>
        </div>
      </div>
    </form>
  );
}
