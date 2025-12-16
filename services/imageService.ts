import { CLAUDNARY_CLOUD_NAME, CLAUDNARY_UPLOAD_PRESET } from "@/constants";
import { ResponseProps } from "@/types";
import axios from "axios";

const CLAUDNARY_API_URL = `https://api.cloudinary.com/v1_1/${CLAUDNARY_CLOUD_NAME}/image/upload`;

export const uploadFileToCloudinary = async (
  file: { uri?: string } | string,
  folderName: string
): Promise<ResponseProps> => {
  try {
    if (!file) return { success: true, data: null };

    //already uploaded file
    if (typeof file == "string") return { success: true, data: file };

    if (file && file.uri) {
      const formData = new FormData();
      formData.append("file", {
        uri: file?.uri,
        type: "image/jpeg",
        name: file?.uri?.split("/").pop() || "file.jpg",
      } as any);
      formData.append("upload_preset", CLAUDNARY_UPLOAD_PRESET);
      formData.append("folder", folderName);

      const response = await axios.post(CLAUDNARY_API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return { success: true, data: response?.data?.secure_url };
    }
    return { success: true, data: null };
  } catch (error: any) {
    console.log("got error uploading file", error);
    return { success: false, msg: error.message || "could not upload file" };
  }
};

export const getAvatarPath = (file: any, isGroup = false) => {
  if (file && typeof file == "string") return file;

  if (file && typeof file == "object") return file.uri;
  if (isGroup) return require("../assets/images/defaultGroupAvatar.png");

  return require("../assets/images/defaultAvatar.png");
};
