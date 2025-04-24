import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "./schema";
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
import { toast } from "sonner";
import { logIn } from "../slice";
import { useAppDispatch } from "@/hook/redux-hook";
import { useState } from "react";
import { LoadingSpinner } from "@/components";
import { tryCatch } from "@/utils";
import { ForgotPasswordForm } from "../forgot-password";
import { DataLogin } from "./login-form-type";

const LoginForm = () => {
  const [open, setOpen] = useState(false);
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

    const { error } = await tryCatch(dispatch(logIn(values)).unwrap());
    if (error) {
      setLoading(false);
      toast.error(String(error));
      return;
    }

    setLoading(false);
    navigate("/");
    toast.success("Login successfully");
  }
  return (
    <div className="flex flex-col justify-center items-center gap-10 sm:p-20 sm:shadow-2xl sm:rounded-2xl sm:inset-shadow-sm">
      <ForgotPasswordForm open={open} setOpen={setOpen} />
      <div className="text-3xl font-bold">Log in</div>
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

          <div className="w-full flex justify-center">
            <Button className="" type="submit">
              {loading ? <LoadingSpinner className="" /> : <>Submit</>}
            </Button>
          </div>
        </form>
      </Form>

      <div
        className=" hover:text-[#313f68] cursor-pointer"
        onClick={() => setOpen(true)}
      >
        Forgotten password?
      </div>
    </div>
  );
};

export default LoginForm;
