import {
  Input,
  Label,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import Avatar from "./_components/avatar";
import { UserDetailContext } from "./model";
import { useAppSelector } from "@/hook/redux-hook";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  listenUserUpdateAvatar,
  updateUserAvatar,
  getUserImagePath,
} from "./action";
import { EnrollMFA } from "../mfa";

const UserDetail = () => {
  const user = useAppSelector((state) => state.user.user);
  const { openUserDetail, setOpenUserDetail } = useContext(UserDetailContext);
  const [avatar, setAvatar] = useState<string>("");

  const updateAvatar = async (avatarUrl: string) => {
    const data = await updateUserAvatar(avatarUrl, user.user_id);
    if (!data.success) {
      toast.error(data.error?.message);
      return;
    }
  };

  const getNewestAvatar = async () => {
    const data = await getUserImagePath(user.user_id);
    if (!data.success) return;
    setAvatar(data.data?.avatar_url);
  };
  useEffect(() => {
    getNewestAvatar();
    listenUserUpdateAvatar(getNewestAvatar);
  }, []);

  return (
    <Sheet open={openUserDetail} onOpenChange={setOpenUserDetail}>
      <SheetContent className="min-w-[100vw] sm:min-w-[30vw] overflow-y-auto sm:overflow-hidden">
        <SheetHeader>
          <SheetTitle>User detail</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="information">
          <div className="w-full justify-center items-center flex gap-5">
            <TabsList className="">
              <TabsTrigger value="information">User information</TabsTrigger>
            </TabsList>
            <TabsList className="">
              <TabsTrigger value="2FA">2FA</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="information">
            <div className="p-5 flex flex-col gap-5">
              <div className="h-full w-full flex flex-col gap-10 p-10">
                <div className="flex flex-col gap-5">
                  <Label>Avatar image</Label>
                  <Avatar
                    url={avatar!}
                    onUpload={(url: string) => {
                      updateAvatar(url);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Full name</Label>
                  <Input disabled value={user.full_name} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Email</Label>
                  <Input disabled value={user.email} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Onboard date</Label>
                  <Input disabled value={String(user.onboard_date)} />
                </div>
                <Button
                  className="w-fit"
                  onClick={() => setOpenUserDetail(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="2FA">
            <EnrollMFA />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default UserDetail;
