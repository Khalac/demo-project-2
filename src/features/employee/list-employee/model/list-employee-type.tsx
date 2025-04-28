export enum role {
  employee = "EMPLOYEE",
  manager = "MANAGER",
  hr = "HR",
}
export type ListEmployeeType = {
  user_id: string;
  role: role;
  manager: {
    email: string;
    full_name: string;
  } | null;
  full_name: string;
  email: string;
  onboard_date: Date;
};
