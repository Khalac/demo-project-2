export enum change_type {
  updated = "UPDATED",
  approved = "APPROVED",
  rejected = "REJECTED",
  cancelled = "CANCELLED",
}
export type LeaveRequestHistory = {
  history_id: string;
  request_id: string;
  users: {
    user_id: string;
    full_name: string;
  };
  changed_at: Date;
  old_data: Record<string, any> | null;
  new_data: Record<string, any> | null;
  change_type: change_type;
};
