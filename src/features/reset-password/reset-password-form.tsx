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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingSpinner } from "@/components";
import { supabase } from "@/utils";
import { useNavigate } from "react-router-dom";
import { ResetPasswordFormSchema } from "./schema";
import { z } from "zod";

type ResetPassword = z.infer<typeof ResetPasswordFormSchema>;

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const form = useForm({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      password: "",
      repassword: "",
    },
  });
  async function onSubmit(values: ResetPassword) {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: values.password,
      });
      console.log(data);
      if (error) setError(error.message);
      console.log(data);

      if (data) navigate("/");
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex flex-col justify-center items-center gap-10 px-20 py-20 shadow-2xl rounded-2xl inset-shadow-sm">
      <div className="text-3xl font-bold text-[#3A5FBE]">
        Reset your password
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Type your new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="repassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
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
              <Button type="submit" className="bg-[#3A5FBE] hover:bg-[#374363]">
                Submit
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
