import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingSpinner } from "@/components";
import { useNavigate } from "react-router-dom";
import { resetPasswordFormSchema } from "./model/schema";
import { updatePassword } from "./action";
import type { ResetPassword } from "./model";
import { toast } from "sonner";

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const form = useForm({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      repassword: "",
    },
  });
  async function onSubmit(values: ResetPassword) {
    setLoading(true);
    const data = await updatePassword(values.password);
    if (!data?.success) {
      setError(data?.error);
      setLoading(false);
    }
    if (data?.success) {
      setLoading(false);
      navigate("/");
      toast.success("Reset password successfully");
    }
  }
  return (
    <div className="flex flex-col justify-center items-center gap-10 sm:p-20 sm:shadow-2xl sm:rounded-2xl sm:inset-shadow-sm">
      <div className="text-3xl font-bold ]">Reset your password</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormDescription className="text-center">
            Inpur your new password
          </FormDescription>
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
            <Button type="submit" className="">
              {loading ? <LoadingSpinner className="" /> : <>Submit</>}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
