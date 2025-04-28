import {
  Button,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  LoadingSpinner,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui";
import { useState } from "react";
import { toast } from "sonner";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { getListFactors, challengeAndVerifyFactor } from "../enrol-mfa";

const InputAuthenticationCode = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [verifyCode, setVerifyCode] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitClicked = async () => {
    setLoading(true);
    const factors = await getListFactors();
    if (!factors.success) {
      setLoading(false);
      return;
    }
    const factorId = factors.data!.all[0].id;

    const data = await challengeAndVerifyFactor(factorId, verifyCode);
    if (!data.success) {
      toast.error(data.error);
      setLoading(false);
      return;
    }
    toast("Success");
    setLoading(false);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="bg-black/90">
        <DialogContent
          className="sm:max-w-[425px] [&>button]:hidden"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="">Input authentication code</DialogTitle>
            <DialogDescription>
              Enter code from your authentication app.
            </DialogDescription>
          </DialogHeader>
          <InputOTP
            pattern={REGEXP_ONLY_DIGITS}
            maxLength={6}
            value={verifyCode}
            onChange={(value) => setVerifyCode(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <DialogFooter>
            <Button onClick={onSubmitClicked}>
              {" "}
              {loading ? <LoadingSpinner className="" /> : <>Submit</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default InputAuthenticationCode;
