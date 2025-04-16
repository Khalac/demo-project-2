export enum changeType {
  updated = "UPDATED",
  approved = "APPROVED",
  rejected = "REJECTED",
  cancelled = "CANCELLED",
  create = 'CREATE'
}
export type LeaveRequestHistory = {
  history_id: string;
  request_id: string;
  notification_to?: string;
  is_read?: boolean;
  users: {
    user_id: string;
    full_name: string;
  };
  changed_at: Date;
  old_data: Record<string, any> | null;
  new_data: Record<string, any> | null;
  change_type: changeType;
};
