export type User = {
  user_id: string;
  full_name: string;
  email: string;
  onboard_date: Date;
  manager: {
    full_name: string;
    email: string;
  };
  avartar_url: string;
};
