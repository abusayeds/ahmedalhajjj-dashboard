import { API_BASE_URL } from "../../config/env";

export interface UploadResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    url: string;
    path?: string;
  };
}

export async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("admin_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = (await response.json()) as UploadResponse;
  if (!response.ok || !data.success || !data.data?.url) {
    throw new Error(data.message || "Image upload failed.");
  }

  return data.data.url;
}
