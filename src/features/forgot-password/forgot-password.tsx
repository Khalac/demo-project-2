import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoadingSpinner } from "@/components";
import { supabase } from "@/utils";
import { useNavigate } from "react-router-dom";

const ForgotPasswordFormSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email(),
});

type ForgotPasswordFormType = z.infer<typeof ForgotPasswordFormSchema>;

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const form = useForm({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });
  async function onSubmit(values: ForgotPasswordFormType) {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: "http://localhost:5173/reset-password",
        }
      );
      if (error) setError(error.message);
      if (data) navigate("/login");
    } catch (error) {
    } finally {
      setLoading(false);
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
                <FormDescription>
                  We will sent a link to your email to change password!!!
                </FormDescription>
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
    </div>
  );
};

export default ForgotPasswordForm;
