export enum status {
  pending = "PENDING",
  approved = "APPROVED",
  rejected = "REJECTED",
  cancel = "CANCELLED",
}
export type ListleaveRequest = {
  request_id?: string;
  user_id?: string;
  start_date: Date;
  end_date: Date;
  total_leave_days: number;
  total_leave_hours: number;
  reason: string;
  status?: status;
  rejected_reason?: string;
  users?: {
    full_name: string;
    email: string;
  }[];
  manager?: {
    full_name: string;
    email: string;
  }[];
};
