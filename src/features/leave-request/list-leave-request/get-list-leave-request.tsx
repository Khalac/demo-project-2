import { supabase } from "@/utils";

const changeToLocalTime = (data: Date) => {
  const date = new Date(data);
  return new Date(date.getTime() + 24 * 60 * 60 * 1000);
};

const getListLeaveRequest = async () => {
  const { data, error } = await supabase
    .from("leave_request")
    .select(
      "start_date, end_date, total_leave_days,total_leave_hours,reason,status, created_at, users!leave_request_user_id_fkey(full_name, email)"
    );

  if (error || !data) return { success: false, error };

  const dataToLocalTime = data.map((item) => ({
    ...item,
    start_date: changeToLocalTime(item.start_date).toDateString(),
    end_date: changeToLocalTime(item.end_date).toDateString(),
  }));
  console.log(dataToLocalTime);
  return { success: true, data: dataToLocalTime };
};

export default getListLeaveRequest;
