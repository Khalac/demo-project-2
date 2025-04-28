import { useEffect, useState } from "react";
import { uploadAvatar } from "../action/upload-avatar";
import { toast } from "sonner";
import { downloadAvatar } from "../action/download-avatar";
import { Input } from "@/components";
import { UserDetailContext } from "../model";
import { useContext } from "react";
import { useTransition } from "react";
import { LoadingSpinner } from "@/components";
export default function Avatar({
  url,
  onUpload,
}: {
  url: string;
  onUpload: (filePath: string) => void;
}) {
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

  return (
    <div className="flex flex-col gap-5">
      <div className="w-full flex justify-center items-center px-5 h-fit">
        {avatarUrl.slice(-4) !== "NULL" ? (
          isPending ? (
            <LoadingSpinner className="" />
          ) : (
            <img src={avatarUrl} alt="Avatar" className="w-2/3 h-auto" />
          )
        ) : (
          <div className="w-2/3 h-[100px] flex justify-center items-center">
            No image found
          </div>
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
