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
import { z } from "zod";
import { LoadingSpinner } from "@/components";
import { supabase } from "@/utils";
import { useNavigate } from "react-router-dom";
import resetPassword from "./reset-password";

const ForgotPasswordFormSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email(),
});

type ForgotPasswordType = z.infer<typeof ForgotPasswordFormSchema>;

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
      setLoading(false);
      setOpen(false);
      navigate("/login");
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#3A5FBE]">Reset password</DialogTitle>
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
                  className="text-[#3A5FBE] bg-white border-none shadow-none hover:bg-white hover:text-red-500"
                >
                  Cancel
                </Button>
                {loading ? (
                  <LoadingSpinner className="text-[#3A5FBE]" />
                ) : (
                  <Button
                    type="submit"
                    className="bg-[#3A5FBE] hover:bg-[#4e608f]"
                  >
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
