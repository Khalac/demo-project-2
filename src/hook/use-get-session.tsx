import { getSession } from "@/features/slice";
import { useAppDispatch, useAppSelector } from "@/hook/redux-hook";
import { useEffect } from "react";

const useGetSession = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.user);
  useEffect(() => {
    dispatch(getSession()).unwrap();
  }, []);
  return { user: data.user, loading: data.loading, error: data.error };
};

export default useGetSession;
