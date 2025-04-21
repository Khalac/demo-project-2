import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingSpinner } from "@/components";

import { useNavigate } from "react-router-dom";
import resetPassword from "./reset-password";

import type { ForgotPasswordType } from "./forgot-password-form-type";
import { ForgotPasswordFormSchema } from "./forgot-password-form-type";
import { toast } from "sonner";

const ForgotPasswordForm = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const form = useForm({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });
  async function onSubmit(values: ForgotPasswordType) {
    setLoading(true);
    const data = await resetPassword(values.email);
    if (!data?.success) setError(error);
    if (data?.success) {
      toast.success("Please check your email to reset password");
      setLoading(false);
      setOpen(false);
      navigate("/login");
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="">Reset password</DialogTitle>
          <DialogDescription>
            Enter your account's email address, and we'll send you a link to
            reset your password.
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Type your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <div className="text-red-600">{error}</div>}
              <DialogFooter>
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-black bg-white border-none shadow-none hover:bg-white hover:text-red-500"
                >
                  Cancel
                </Button>
                {loading ? (
                  <LoadingSpinner className="" />
                ) : (
                  <Button type="submit" className="">
                    Submit
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordForm;
