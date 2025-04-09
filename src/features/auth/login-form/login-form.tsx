import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "./schema";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components";

import { logIn } from "../slice";
import { useAppDispatch } from "@/hook/redux-hook";
import { useState } from "react";
import { LoadingSpinner } from "@/components";
import { tryCatch } from "@/utils";
import { ForgotPasswordForm } from "../forgot-password";

type DataLogin = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: DataLogin) {
    setLoading(true);

    const { data, error } = await tryCatch(dispatch(logIn(values)).unwrap());
    if (error) {
      setLoading(false);
      setError(error);
    }
    if (data?.success) {
      setLoading(false);
      navigate("/");
    }
  }
  return (
    <div className="flex flex-col justify-center items-center gap-10 px-20 py-20 shadow-2xl rounded-2xl inset-shadow-sm">
      <ForgotPasswordForm open={open} setOpen={setOpen} />
      <div className="text-3xl font-bold text-[#3A5FBE]">Log in</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <div className="text-red-600">{error}</div>}
          <div className="w-full flex justify-center">
            {loading ? (
              <LoadingSpinner className="" />
            ) : (
              <Button className="bg-[#3A5FBE]" type="submit">
                Submit
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div
        className=" text-[#3A5FBE] hover:text-[#313f68] cursor-pointer"
        onClick={() => setOpen(true)}
      >
        Forgotten password?
      </div>
    </div>
  );
};

export default LoginForm;
