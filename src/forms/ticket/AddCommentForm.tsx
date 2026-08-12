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

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex gap-2">
      <div className="flex-1 flex flex-col gap-1">
        <input
          type="text"
          placeholder="Post an update..."
          {...register("content")}
          className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        {errors.content && (
          <span className="text-xs text-red-400">{errors.content.message}</span>
        )}
      </div>
      <Button type="submit" disabled={isPending} className="text-xs py-2">
        {isPending ? "Sending..." : "Comment"}
      </Button>
    </form>
  );
}
