import { useEffect, useState } from "react";
import { uploadAvatar } from "../action/upload-avatar";
import { toast } from "sonner";
import { downloadAvatar } from "../action/download-avatar";
import {
  Input,
  Avatar as AvatarUI,
  AvatarFallback,
  AvatarImage,
} from "@/components";
import { UserDetailContext } from "../model";
import { useContext } from "react";
import { useTransition } from "react";
import { LoadingSpinner } from "@/components";
import { useAppSelector } from "@/hook/redux-hook";

export default function Avatar({
  url,
  onUpload,
}: {
  url: string;
  onUpload: (filePath: string) => void;
}) {
  const user = useAppSelector((state) => state.user.user);
  const { setAvatar } = useContext(UserDetailContext);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  const downloadImage = (path: string) => {
    startTransition(async () => {
      const data = await downloadAvatar(path);
      if (!data.success) {
        return;
      }
      setAvatarUrl(data.data!);
      setAvatar(data.data!);
    });
  };

  const userUploadAvatar = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUploading(true);

    if (!event.target.files || event.target.files.length === 0) {
      toast.error("You must select an image to upload.");
    }

    const file = event.target.files![0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;

    const data = await uploadAvatar(fileName, file);
    if (!data.success) {
      toast.error(data.error?.message);
      return;
    }
    onUpload(fileName);
    setUploading(false);
  };
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="w-full flex justify-center items-center px-5 h-fit">
        {avatarUrl.slice(-4) !== "NULL" ? (
          isPending ? (
            <LoadingSpinner className="" />
          ) : (
            <AvatarUI className="flex justify-center items-center size-20 sm:size-40">
              <AvatarImage src={avatarUrl} alt="avatar" />
            </AvatarUI>
          )
        ) : (
          <AvatarUI className="flex justify-center items-center w-1/2 size-20 sm:size-40">
            <AvatarFallback className="font-bold text-xl sm:text-4xl">
              {getInitials(user.full_name)}
            </AvatarFallback>
          </AvatarUI>
        )}
      </div>
      <div>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => userUploadAvatar(e)}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
