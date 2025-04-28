import { useState, useEffect } from "react";
import { Button, Input, Label, Skeleton } from "@/components/ui";
import { toast } from "sonner";
import {
  getListFactors,
  unenrollFactor,
  challengeAndVerifyFactor,
  enrollNewFactor,
} from "./action";
import { UserDetailContext } from "../../user-information";
import { useContext } from "react";

export function EnrollMFA() {
  const { setOpenUserDetail } = useContext(UserDetailContext);

  const [factorId, setFactorId] = useState("");
  const [qr, setQR] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [hasEnable, setHasEnable] = useState<boolean>();
  const [loading, setLoading] = useState(false);

  const onEnableClicked = async () => {
    const data = await challengeAndVerifyFactor(factorId, verifyCode);
    if (!data.success) {
      toast.error(data.error);
      return;
    }
    toast("Enable 2FA success");
    setOpenUserDetail(false);
  };
  const turnOff2FA = async () => {
    const factors = await getListFactors();
    if (!factors.success) {
      toast.error(factors.error);
      return;
    }
    const factorId = factors.data?.all[0].id as string;
    const res = await unenrollFactor(factorId);
    if (!res.success) {
      toast.error(res.error);
      return;
    }
    toast("Turn off 2FA success");
    setOpenUserDetail(false);
  };
  const enrollFactor = async () => {
    setLoading(true);
    const factors = await getListFactors();
    if (!factors.success) {
      toast.error(factors.error);
      setLoading(false);
      return;
    }
    if (factors.data?.all.length === 0) {
      setHasEnable(false);
      const data = await enrollNewFactor();
      if (!data.success) {
        setLoading(false);
        return;
      }

      setFactorId(data.data!.id);

      setQR(data.data!.totp.qr_code);
      setLoading(false);
      return;
    }
    if (factors.data?.all[0].status === "unverified") {
      setHasEnable(false);
      const factorId = factors.data?.all[0].id as string;
      const res = await unenrollFactor(factorId);
      if (!res.success) {
        setLoading(false);
        return;
      }
      const data = await enrollNewFactor();
      if (!data.success) {
        setLoading(false);
        return;
      }

      setFactorId(data.data!.id);

      setQR(data.data!.totp.qr_code);
      setLoading(false);
      return;
    }
    setHasEnable(true);
    setFactorId(factors.data?.all[0].id!);
    setLoading(false);
  };
  useEffect(() => {
    enrollFactor();
  }, [hasEnable]);
  return (
    <div className="flex flex-col items-center space-x-2 p-10">
      {loading ? (
        <Skeleton className="w-1/2 h-40" />
      ) : (
        <div className="h-full w-full flex flex-col gap-10 p-10 justify-center items-center">
          {!hasEnable && (
            <>
              <div className="w-full flex flex-col gap-3 items-center">
                <Label>Scan QR with your authentication app</Label>
                <img src={qr} className="w-2/3 h-auto" />
              </div>
              <div className="flex flex-col gap-3">
                <Label>Input verify code</Label>
                <Input
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.trim())}
                />
              </div>
            </>
          )}
          {hasEnable && (
            <div className="font-bold">
              Two-factor authentication (2FA) has been enabled on your account.
            </div>
          )}
          <div className="flex gap-5">
            {!hasEnable && (
              <Button
                onClick={onEnableClicked}
                className="cursor-pointer w-fit"
              >
                Enable
              </Button>
            )}
            {hasEnable && (
              <Button
                variant="destructive"
                onClick={turnOff2FA}
                className="cursor-pointer w-fit"
              >
                Turn off 2FA
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default EnrollMFA;
