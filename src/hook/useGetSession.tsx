import { getUserSession } from "@/features";
import { useAppDispatch, useAppSelector } from "@/hook/reduxHook";
import { useEffect } from "react";

const useGetSession = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.user);
  useEffect(() => {
    dispatch(getUserSession()).unwrap();
  }, []);
  return { user: data.user, loading: data.loading, error: data.error };
};

export default useGetSession;
