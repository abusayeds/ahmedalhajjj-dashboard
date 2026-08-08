import { useState, useEffect, useRef } from "react";
import {
  Bold, Italic, Heading1, Heading2, List, ListOrdered, Quote, Code,
  Edit3, Save, RefreshCw, Check, AlertCircle
} from "lucide-react";
import { C, P, M, AD, APrimary, ACard } from "./shared";
import { useToast } from "./SuccessToast";
import { useGetManagementQuery, useUpdateManagementMutation } from "../../store/api/managementApi";
import { API_BASE_URL } from "../../config/env";

interface ManagementEditorProps {
  type: "terms" | "about" | "privacy";
  title: string;
  subtitle: string;
}

export default function ManagementEditor({ type, title, subtitle }: ManagementEditorProps) {
  const { showToast } = useToast();
  const { data, isLoading, isFetching, refetch, error } = useGetManagementQuery(type);
  const [updateManagement, { isLoading: isUpdating }] = useUpdateManagementMutation();

  const [content, setContent] = useState("");
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync content when API data arrives
  useEffect(() => {
    if (data?.data?.description !== undefined) {
      setContent(data.data.description || "");
    }
  }, [data]);

  const handleFormat = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleSave = async () => {
    let finalContent = content;
    if (mode === "visual" && editorRef.current) {
      finalContent = editorRef.current.innerHTML;
      setContent(finalContent);
    }

    if (!finalContent || !finalContent.trim()) {
      showToast("Content cannot be empty!", "warning");
      return;
    }

    try {
      const res = await updateManagement({ type, description: finalContent }).unwrap();
      if (res.success) {
        showToast(res.message || `${title} updated successfully!`, "success");
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err: any) {
      showToast(err?.data?.message || `Failed to update ${title}`, "error");
    }
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: P, fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 6px", letterSpacing: "-0.4px" }}>
            {title} Editor
          </h2>
          <div style={{ fontFamily: P, fontSize: 13, color: C.tm }}>
            {subtitle}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
              background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 9,
              fontFamily: P, fontSize: 12, color: C.t2, cursor: "pointer"
            }}
          >
            <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} color={C.tm} /> Refresh
          </button>
          <APrimary
            onClick={handleSave}
            disabled={isUpdating || isLoading}
            icon={isUpdating ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </APrimary>
        </div>
      </div>

      {savedSuccess && (
        <div style={{ marginBottom: 16, background: "rgba(0,208,132,0.1)", border: "1px solid rgba(0,208,132,0.25)", borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, fontFamily: P, fontSize: 13, color: C.buy }}>
          <Check size={16} color={C.buy} /> {title} content saved and updated successfully to the API database!
        </div>
      )}

      {error && (
        <div style={{ marginBottom: 16, background: "rgba(255,90,107,0.1)", border: "1px solid rgba(255,90,107,0.25)", borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, fontFamily: P, fontSize: 13, color: C.sell }}>
          <AlertCircle size={16} color={C.sell} /> Backend server offline on {API_BASE_URL}. You can still edit and preview content locally.
        </div>
      )}

      <ACard style={{ padding: 0, overflow: "hidden", border: `1px solid ${AD.cardB}` }}>
        {/* Editor Toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", background: "rgba(255,255,255,0.02)", borderBottom: `1px solid ${AD.cardB}`, flexWrap: "wrap", gap: 10 }}>
          {/* Formatting Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
            <button
              onClick={() => handleFormat("bold")}
              title="Bold"
              style={{ padding: "6px 10px", background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 6, color: C.t1, cursor: "pointer" }}
            >
              <Bold size={14} />
            </button>
            <button
              onClick={() => handleFormat("italic")}
              title="Italic"
              style={{ padding: "6px 10px", background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 6, color: C.t1, cursor: "pointer" }}
            >
              <Italic size={14} />
            </button>
            <div style={{ width: 1, height: 20, background: AD.cardB, margin: "0 4px" }} />
            <button
              onClick={() => handleFormat("formatBlock", "<h1>")}
              title="Heading 1"
              style={{ padding: "6px 10px", background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 6, color: C.t1, cursor: "pointer" }}
            >
              <Heading1 size={14} />
            </button>
            <button
              onClick={() => handleFormat("formatBlock", "<h2>")}
              title="Heading 2"
              style={{ padding: "6px 10px", background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 6, color: C.t1, cursor: "pointer" }}
            >
              <Heading2 size={14} />
            </button>
            <div style={{ width: 1, height: 20, background: AD.cardB, margin: "0 4px" }} />
            <button
              onClick={() => handleFormat("insertUnorderedList")}
              title="Bullet List"
              style={{ padding: "6px 10px", background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 6, color: C.t1, cursor: "pointer" }}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => handleFormat("insertOrderedList")}
              title="Numbered List"
              style={{ padding: "6px 10px", background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 6, color: C.t1, cursor: "pointer" }}
            >
              <ListOrdered size={14} />
            </button>
            <button
              onClick={() => handleFormat("formatBlock", "<blockquote>")}
              title="Quote"
              style={{ padding: "6px 10px", background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 6, color: C.t1, cursor: "pointer" }}
            >
              <Quote size={14} />
            </button>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 8, padding: 3 }}>
            <button
              onClick={() => {
                if (mode === "html" && editorRef.current) {
                  editorRef.current.innerHTML = content;
                }
                setMode("visual");
              }}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "5px 12px",
                background: mode === "visual" ? C.brand : "transparent",
                color: mode === "visual" ? "#fff" : C.tm,
                border: "none", borderRadius: 6, fontFamily: P, fontSize: 11, fontWeight: 600, cursor: "pointer"
              }}
            >
              <Edit3 size={13} /> Visual Editor
            </button>
            <button
              onClick={() => {
                if (mode === "visual" && editorRef.current) {
                  setContent(editorRef.current.innerHTML);
                }
                setMode("html");
              }}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "5px 12px",
                background: mode === "html" ? C.brand : "transparent",
                color: mode === "html" ? "#fff" : C.tm,
                border: "none", borderRadius: 6, fontFamily: P, fontSize: 11, fontWeight: 600, cursor: "pointer"
              }}
            >
              <Code size={13} /> HTML Source
            </button>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div style={{ padding: 60, textAlign: "center", color: C.tm, fontFamily: P, fontSize: 14 }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 12px", color: C.brand }} />
            Loading {title} content from server API...
          </div>
        ) : mode === "visual" ? (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={() => {
              if (editorRef.current) {
                setContent(editorRef.current.innerHTML);
              }
            }}
            dangerouslySetInnerHTML={{ __html: content }}
            key={`${type}-${data?.data?.updatedAt || "loaded"}`}
            style={{
              minHeight: 380,
              padding: 24,
              fontFamily: P,
              fontSize: 14,
              lineHeight: 1.7,
              color: C.t1,
              outline: "none",
              background: AD.bg,
            }}
          />
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Enter HTML content for ${title}...`}
            style={{
              width: "100%",
              minHeight: 380,
              padding: 24,
              fontFamily: M,
              fontSize: 13,
              lineHeight: 1.6,
              color: C.t1,
              background: AD.bg,
              border: "none",
              outline: "none",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
        )}
      </ACard>
    </div>
  );
}
