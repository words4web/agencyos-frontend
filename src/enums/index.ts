export enum EUserRole {
  ADMIN = "admin",
  EMPLOYEE = "employee",
}

export enum EProjectStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  ARCHIVED = "archived",
}

export enum ETicketStatus {
  BACKLOG = "backlog",
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  IN_REVIEW = "in_review",
  COMPLETED = "completed",
}

export enum ETicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum EPlatformType {
  WEB = "web",
}

export enum EAssetProvider {
  GOOGLE_DRIVE = "google_drive",
  URL = "url",
}

export enum EUploadStatus {
  IDLE = "idle",
  UPLOADING = "uploading",
  DONE = "done",
  ERROR = "error",
}

export enum EEventType {
  HOLIDAY = "holiday",
  MEETING = "meeting",
  REMINDER = "reminder",
  LEAVE = "leave",
}

export enum ELeaveType {
  PAID = "paid",
  UNPAID = "unpaid",
}

