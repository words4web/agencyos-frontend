import { EEventType } from "@/enums";

export function getEventClassNames(type: EEventType): string {
  switch (type) {
    case EEventType.HOLIDAY:
      return "bg-rose-500/10 border-rose-500/20 text-rose-400";
    case EEventType.MEETING:
      return "bg-indigo-500/10 border-indigo-500/20 text-indigo-400";
    case EEventType.REMINDER:
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    default:
      return "bg-slate-500/10 border-slate-500/20 text-slate-400";
  }
}
