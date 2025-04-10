enum status {
  pending = "Pending",
  approved = "Approved",
  rejected = "Rejected",
}
export type ListleaveRequest = {
  start_date: Date;
  end_date: Date;
  total_leave_days: number;
  total_leave_hours: number;
  reason: string;
  status: status;
  created_at: Date;
  users: {
    full_name: string;
    email: string;
  }[];
};
