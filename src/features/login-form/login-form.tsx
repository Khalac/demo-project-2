import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema } from "./schema";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components";

import { logIn } from "./slice";
import { useAppDispatch } from "@/hook/redux-hook";
import { useState } from "react";
import { LoadingSpinner } from "@/components";
import { tryCatch } from "@/utils";

type DataLogin = z.infer<typeof LoginSchema>;

const LoginForm = () => {
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: DataLogin) {
    setLoading(true);

    const { data, error } = await tryCatch(dispatch(logIn(values)).unwrap());
    if (error) setError(error);
    if (data?.success) {
      setLoading(false);
      navigate("/");
    }
  }
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <div className="text-3xl font-bold">Log in</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Type your email" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Type your password"
                    {...field}
                  />
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
              <Button type="submit">Submit</Button>
            )}
          </div>
        </form>
      </Form>
      <Link to={"/login/forgot-password"}>Forgotten password?</Link>
    </div>
  );
};

export default LoginForm;
