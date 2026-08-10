import { useRef, useState } from "react";
import { Image, Loader2, Trash2 } from "lucide-react";
import { C, P, AD } from "./shared";
import { resolveMediaUrl } from "../../config/env";
import { uploadImageFile } from "../../store/api/uploadApi";
import { useToast } from "./SuccessToast";

type PostCoverUploadProps = {
  value: string;
  onChange: (url: string) => void;
};

export default function PostCoverUpload({ value, onChange }: PostCoverUploadProps) {
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a PNG or JPG image.", "warning");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImageFile(file);
      onChange(url);
      showToast("Banner image uploaded.");
    } catch (error: any) {
      showToast(error?.message || "Failed to upload image", "error");
    } finally {
      setUploading(false);
    }
  };

  const previewUrl = resolveMediaUrl(value);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        style={{
          border: `2px dashed ${value ? "rgba(128,0,255,0.35)" : AD.cardB}`,
          borderRadius: 12,
          minHeight: 140,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          cursor: uploading ? "wait" : "pointer",
          background: "rgba(255,255,255,0.01)",
          transition: "all 0.2s",
          overflow: "hidden",
          position: "relative",
        }}
        className="a-btn"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Post cover preview"
            style={{ width: "100%", height: 180, objectFit: "cover" }}
          />
        ) : (
          <>
            {uploading ? <Loader2 size={22} color={C.brand} className="animate-spin" /> : <Image size={22} color={C.td} />}
            <span style={{ fontFamily: P, fontSize: 12, color: C.td }}>
              {uploading ? "Uploading banner image..." : "Upload banner image"}
            </span>
            <span style={{ fontFamily: P, fontSize: 10, color: C.td }}>PNG or JPG · 1200×480px recommended</span>
          </>
        )}
      </div>

      {value && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: P, fontSize: 11, color: C.tm, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {value}
          </span>
          <button
            type="button"
            onClick={() => onChange("")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 10px",
              borderRadius: 8,
              border: `1px solid ${AD.inpB}`,
              background: AD.inp,
              color: C.sell,
              fontFamily: P,
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            <Trash2 size={12} /> Remove
          </button>
        </div>
      )}
    </div>
  );
}
