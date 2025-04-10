export enum status {
  pending = "PENDING",
  approved = "APPROVED",
  rejected = "REJECTED",
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
  created_at?: Date;
  rejected_reason?: string;
  users?: {
    full_name: string;
    email: string;
  }[];
};
