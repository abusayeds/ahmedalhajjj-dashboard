import { useState, useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Edit3,
  Save,
  RefreshCw,
  Check,
  AlertCircle,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Unlink,
  Minus,
  IndentIncrease,
  IndentDecrease,
  Undo2,
  Redo2,
  Eraser,
  Pilcrow,
  RemoveFormatting,
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

const FONT_SIZES = [
  { label: "Small", value: "2" },
  { label: "Normal", value: "3" },
  { label: "Large", value: "4" },
  { label: "X-Large", value: "5" },
  { label: "Huge", value: "6" },
];

const TEXT_COLORS = [
  "#FFFFFF",
  "#E2E8F0",
  "#94A3B8",
  "#C084FC",
  "#60A5FA",
  "#00D084",
  "#F59E0B",
  "#FF5A6B",
];

const HIGHLIGHT_COLORS = [
  "transparent",
  "#8000FF",
  "#1E3A5F",
  "#14532D",
  "#78350F",
  "#7F1D1D",
  "#334155",
];

function ToolbarBtn({
  title,
  onClick,
  children,
  active,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      style={{
        padding: "6px 10px",
        background: active ? "rgba(128,0,255,0.2)" : AD.inp,
        border: `1px solid ${active ? C.brand : AD.inpB}`,
        borderRadius: 6,
        color: C.t1,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div style={{ width: 1, height: 20, background: AD.cardB, margin: "0 4px" }} />;
}

export default function ManagementEditor({ type, title, subtitle }: ManagementEditorProps) {
  const { showToast } = useToast();
  const { data, isLoading, isFetching, refetch, error } = useGetManagementQuery(type);
  const [updateManagement, { isLoading: isUpdating }] = useUpdateManagementMutation();

  const [content, setContent] = useState("");
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const loadedTypeRef = useRef<string | null>(null);

  const applyHtmlToEditor = (html: string) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = html;
    }
  };

  useEffect(() => {
    loadedTypeRef.current = null;
    setMode("visual");
  }, [type]);

  useEffect(() => {
    if (isLoading) return;
    if (loadedTypeRef.current === type) return;

    const html = data?.data?.description || "";
    setContent(html);
    loadedTypeRef.current = type;
    requestAnimationFrame(() => applyHtmlToEditor(html));
  }, [type, isLoading, data?.data?.description]);

  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleFormat = (command: string, value?: string) => {
    focusEditor();
    document.execCommand(command, false, value);
  };

  const handleInsertLink = () => {
    focusEditor();
    const url = window.prompt("Enter link URL (https://...)", "https://");
    if (!url) return;
    handleFormat("createLink", url.trim());
  };

  const getEditorHtml = () => {
    if (mode === "visual" && editorRef.current) {
      return editorRef.current.innerHTML;
    }
    return content;
  };

  const handleSave = async () => {
    const finalContent = getEditorHtml();
    setContent(finalContent);

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

  const handleRefresh = async () => {
    loadedTypeRef.current = null;
    const result = await refetch();
    const html = result.data?.data?.description || "";
    setContent(html);
    loadedTypeRef.current = type;
    requestAnimationFrame(() => applyHtmlToEditor(html));
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100 }}>
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
            onClick={handleRefresh}
            disabled={isFetching}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              background: AD.inp,
              border: `1px solid ${AD.inpB}`,
              borderRadius: 9,
              fontFamily: P,
              fontSize: 12,
              color: C.t2,
              cursor: "pointer",
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", background: "rgba(255,255,255,0.02)", borderBottom: `1px solid ${AD.cardB}`, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
            <ToolbarBtn title="Undo" onClick={() => handleFormat("undo")}>
              <Undo2 size={14} />
            </ToolbarBtn>
            <ToolbarBtn title="Redo" onClick={() => handleFormat("redo")}>
              <Redo2 size={14} />
            </ToolbarBtn>
            <ToolbarDivider />

            <ToolbarBtn title="Bold" onClick={() => handleFormat("bold")}>
              <Bold size={14} />
            </ToolbarBtn>
            <ToolbarBtn title="Italic" onClick={() => handleFormat("italic")}>
              <Italic size={14} />
            </ToolbarBtn>
            <ToolbarBtn title="Underline" onClick={() => handleFormat("underline")}>
              <Underline size={14} />
            </ToolbarBtn>
            <ToolbarBtn title="Strikethrough" onClick={() => handleFormat("strikeThrough")}>
              <Strikethrough size={14} />
            </ToolbarBtn>
            <ToolbarBtn title="Clear formatting" onClick={() => handleFormat("removeFormat")}>
              <RemoveFormatting size={14} />
            </ToolbarBtn>
            <ToolbarDivider />

            <select
              title="Font size"
              defaultValue="3"
              onChange={(e) => handleFormat("fontSize", e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                padding: "6px 8px",
                background: AD.inp,
                border: `1px solid ${AD.inpB}`,
                borderRadius: 6,
                color: C.t1,
                fontFamily: P,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              {FONT_SIZES.map((size) => (
                <option key={size.value} value={size.value} style={{ background: "#110F20" }}>
                  {size.label}
                </option>
              ))}
            </select>

            <div style={{ display: "flex", alignItems: "center", gap: 3, padding: "4px 6px", background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 6 }}>
              {TEXT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  title={`Text color ${color}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleFormat("foreColor", color)}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    background: color,
                    border: "1px solid rgba(255,255,255,0.2)",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 3, padding: "4px 6px", background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 6 }}>
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  title="Highlight color"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleFormat("hiliteColor", color === "transparent" ? "#000000" : color)}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    background: color === "transparent" ? AD.bg : color,
                    border: "1px solid rgba(255,255,255,0.2)",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
            <ToolbarDivider />

            <ToolbarBtn title="Paragraph" onClick={() => handleFormat("formatBlock", "p")}>
              <Pilcrow size={14} />
            </ToolbarBtn>
            <ToolbarBtn title="Heading 1" onClick={() => handleFormat("formatBlock", "h1")}>
              <Heading1 size={14} />
            </ToolbarBtn>
            <ToolbarBtn title="Heading 2" onClick={() => handleFormat("formatBlock", "h2")}>
              <Heading2 size={14} />
            </ToolbarBtn>
            <ToolbarBtn title="Heading 3" onClick={() => handleFormat("formatBlock", "h3")}>
              <Heading3 size={14} />
            </ToolbarBtn>
            <ToolbarDivider />

            <ToolbarBtn title="Align left" onClick={() => handleFormat("justifyLeft")}>
              <AlignLeft size={14} />
            </ToolbarBtn>
            <ToolbarBtn title="Align center" onClick={() => handleFormat("justifyCenter")}>
              <AlignCenter size={14} />
            </ToolbarBtn>
            <ToolbarBtn title="Align right" onClick={() => handleFormat("justifyRight")}>
              <AlignRight size={14} />
            </ToolbarBtn>
            <ToolbarBtn title="Justify" onClick={() => handleFormat("justifyFull")}>
              <AlignJustify size={14} />
            </ToolbarBtn>
            <ToolbarDivider />

            <ToolbarBtn title="Bullet list" onClick={() => handleFormat("insertUnorderedList")}>
              <List size={14} />
            </ToolbarBtn>
            <ToolbarBtn title="Numbered list" onClick={() => handleFormat("insertOrderedList")}>
              <ListOrdered size={14} />
            </ToolbarBtn>
            <ToolbarBtn title="Increase indent" onClick={() => handleFormat("indent")}>
              <IndentIncrease size={14} />
            </ToolbarBtn>
            <ToolbarBtn title="Decrease indent" onClick={() => handleFormat("outdent")}>
              <IndentDecrease size={14} />
            </ToolbarBtn>
            <ToolbarBtn title="Quote" onClick={() => handleFormat("formatBlock", "blockquote")}>
              <Quote size={14} />
            </ToolbarBtn>
            <ToolbarBtn title="Horizontal line" onClick={() => handleFormat("insertHorizontalRule")}>
              <Minus size={14} />
            </ToolbarBtn>
            <ToolbarDivider />

            <ToolbarBtn title="Insert link" onClick={handleInsertLink}>
              <Link size={14} />
            </ToolbarBtn>
            <ToolbarBtn title="Remove link" onClick={() => handleFormat("unlink")}>
              <Unlink size={14} />
            </ToolbarBtn>
            <ToolbarBtn title="Clear all" onClick={() => {
              focusEditor();
              if (editorRef.current) {
                editorRef.current.innerHTML = "";
              }
            }}>
              <Eraser size={14} />
            </ToolbarBtn>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 8, padding: 3 }}>
            <button
              onClick={() => {
                setMode("visual");
                requestAnimationFrame(() => applyHtmlToEditor(content));
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                background: mode === "visual" ? C.brand : "transparent",
                color: mode === "visual" ? "#fff" : C.tm,
                border: "none",
                borderRadius: 6,
                fontFamily: P,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
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
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                background: mode === "html" ? C.brand : "transparent",
                color: mode === "html" ? "#fff" : C.tm,
                border: "none",
                borderRadius: 6,
                fontFamily: P,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Code size={13} /> HTML Source
            </button>
          </div>
        </div>

        {isLoading ? (
          <div style={{ padding: 60, textAlign: "center", color: C.tm, fontFamily: P, fontSize: 14 }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 12px", color: C.brand }} />
            Loading {title} content from server API...
          </div>
        ) : mode === "visual" ? (
          <div
            ref={editorRef}
            className="management-rich-editor"
            contentEditable
            suppressContentEditableWarning
            style={{
              minHeight: 420,
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
              minHeight: 420,
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

      <style>{`
        .management-rich-editor h1 { font-size: 1.75rem; font-weight: 700; margin: 0.75rem 0; }
        .management-rich-editor h2 { font-size: 1.35rem; font-weight: 700; margin: 0.65rem 0; }
        .management-rich-editor h3 { font-size: 1.1rem; font-weight: 600; margin: 0.55rem 0; }
        .management-rich-editor p { margin: 0.5rem 0; }
        .management-rich-editor blockquote {
          margin: 0.75rem 0;
          padding: 10px 14px;
          border-left: 3px solid ${C.brand};
          background: rgba(128,0,255,0.08);
          border-radius: 0 8px 8px 0;
        }
        .management-rich-editor ul, .management-rich-editor ol { margin: 0.5rem 0; padding-left: 1.5rem; }
        .management-rich-editor a { color: ${C.brand}; text-decoration: underline; }
        .management-rich-editor hr { border: none; border-top: 1px solid rgba(255,255,255,0.12); margin: 1rem 0; }
      `}</style>
    </div>
  );
}
