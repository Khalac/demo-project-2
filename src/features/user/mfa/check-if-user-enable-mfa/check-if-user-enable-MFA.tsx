import { useState, useEffect } from "react";
import { getAuthenticatorAssuranceLevel } from "./action";
import { toast } from "sonner";
import { InputAuthenticationCode } from "../input-authentication-code";

const CheckIfUserEnableMFA = () => {
  const [showMFAScreen, setShowMFAScreen] = useState(false);
  const [open, setOpen] = useState(false);
  const checkMFA = async () => {
    const data = await getAuthenticatorAssuranceLevel();
    if (!data.success) {
      toast.error(data.error);
      return;
    }
    if (
      data.data?.nextLevel === "aal2" &&
      data.data?.nextLevel !== data.data?.currentLevel
    ) {
      setShowMFAScreen(true);
      setOpen(true);
    }
  };
  useEffect(() => {
    checkMFA();
  }, []);

  if (showMFAScreen) {
    return <InputAuthenticationCode open={open} setOpen={setOpen} />;
  }
};
export default CheckIfUserEnableMFA;
