import { useMemo, useState } from "react";
import {
  Plus, Pencil, Trash2, Search, RefreshCw, BookOpen,
  FileText, Image, Bell, ChevronLeft, ChevronRight, Eye, Calendar, Send,
} from "lucide-react";
import {
  C, P, M, AD, APrimary, AGhost, AIn, ATa, ASel, AModal, ACard, Chip, IconBtn,
  PostData,
} from "./shared";
import { ConfirmDeleteModal, ConfirmActionModal } from "./ConfirmDeleteModal";
import { useToast } from "./SuccessToast";
import {
  mapApiPost,
  useCreatePostMutation,
  useDeletePostMutation,
  useGetPostsQuery,
  usePublishPostMutation,
  useSchedulePostMutation,
  useUpdatePostMutation,
} from "../../store/api/postApi";

type PostForm = {
  title: string;
  body: string;
  cat: string;
  schedule: string;
  mode: "publish" | "schedule";
  coverImage: string;
};

const emptyForm = (): PostForm => ({
  title: "",
  body: "",
  cat: "Market Update",
  schedule: "",
  mode: "publish",
  coverImage: "",
});

const toPayload = (form: PostForm, status?: string) => ({
  title: form.title,
  body: form.body,
  category: form.cat,
  coverImage: form.coverImage || undefined,
  status: status || (form.mode === "schedule" ? "Scheduled" : "Published"),
  scheduledAt: form.schedule ? new Date(form.schedule).toISOString() : undefined,
});

function PostFormFields({
  form,
  setForm,
}: {
  form: PostForm;
  setForm: React.Dispatch<React.SetStateAction<PostForm>>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
      <div style={{ border: `2px dashed ${AD.cardB}`, borderRadius: 12, height: 110, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 7, cursor: "pointer", background: "rgba(255,255,255,0.01)", transition: "all 0.2s" }} className="a-btn">
        <Image size={22} color={C.td} />
        <span style={{ fontFamily: P, fontSize: 12, color: C.td }}>Upload banner image</span>
        <span style={{ fontFamily: P, fontSize: 10, color: C.td }}>PNG or JPG · 1200×480px recommended</span>
      </div>
      <AIn label="Cover Image URL (optional)" placeholder="https://..." value={form.coverImage} onChange={(v) => setForm({ ...form, coverImage: v })} />
      <AIn label="Post Title" placeholder="Write a compelling headline…" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
      <ATa label="Content" placeholder="Write the post body…" value={form.body} onChange={(v) => setForm({ ...form, body: v })} rows={4} />
      <ASel label="Category" value={form.cat} onChange={(v) => setForm({ ...form, cat: v })} opts={[{ l: "Market Update", v: "Market Update" }, { l: "Education", v: "Education" }, { l: "News", v: "News" }, { l: "Announcement", v: "Announcement" }]} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
        <ASel label="Publish Mode" value={form.mode} onChange={(v) => setForm({ ...form, mode: v as "publish" | "schedule" })} opts={[{ l: "Publish Now", v: "publish" }, { l: "Schedule for Later", v: "schedule" }]} />
        {form.mode === "schedule" && <AIn label="Schedule Time" placeholder="2026-08-09T09:00" value={form.schedule} onChange={(v) => setForm({ ...form, schedule: v })} type="datetime-local" />}
      </div>
      {form.title && <div style={{ background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 11, padding: "16px 18px" }}>
        <div style={{ fontFamily: M, fontSize: 9, color: C.td, letterSpacing: "0.12em", marginBottom: 12 }}>PREVIEW</div>
        <div style={{ fontFamily: P, fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 6 }}>{form.title}</div>
        <div style={{ fontFamily: P, fontSize: 12, color: C.tm, lineHeight: 1.5 }}>{form.body || "Post content will appear here..."}</div>
        <div style={{ marginTop: 10 }}><span style={{ fontFamily: P, fontSize: 11, color: C.td }}>Category: {form.cat}</span></div>
      </div>}
      <div style={{ background: "rgba(128,0,255,0.06)", border: "1px solid rgba(128,0,255,0.14)", borderRadius: 11, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" }}>
        <Bell size={13} color="#C084FC" />
        <span style={{ fontFamily: P, fontSize: 11, color: C.t2 }}>Publishing will automatically send a push notification to all subscribers.</span>
      </div>
    </div>
  );
}

export default function APosts() {
  const { showToast } = useToast();
  const [createModal, setCreateModal] = useState(false);
  const [editTarget, setEditTarget] = useState<PostData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PostData | null>(null);
  const [publishTarget, setPublishTarget] = useState<PostData | null>(null);
  const [previewTarget, setPreviewTarget] = useState<PostData | null>(null);
  const [scheduleTarget, setScheduleTarget] = useState<PostData | null>(null);
  const [catFilter, setCatFilter] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState<PostForm>(emptyForm());
  const [scheduleDate, setScheduleDate] = useState("");

  const { data, isLoading, isFetching, refetch } = useGetPostsQuery({
    category: catFilter,
    searchTerm: searchTerm || undefined,
  });
  const [createPost, { isLoading: creating }] = useCreatePostMutation();
  const [updatePost, { isLoading: updating }] = useUpdatePostMutation();
  const [deletePost, { isLoading: deleting }] = useDeletePostMutation();
  const [publishPost, { isLoading: publishing }] = usePublishPostMutation();
  const [schedulePost, { isLoading: scheduling }] = useSchedulePostMutation();

  const loading = creating || updating || deleting || publishing || scheduling;
  const posts = useMemo(() => (data?.data || []).map(mapApiPost), [data?.data]);

  const catCol: Record<string, string> = { "Market Update": C.gold, Education: "#C084FC", News: "#60A5FA", Announcement: C.buy };
  const COLS = "80px minmax(280px, 1fr) 160px 120px 120px 120px 160px 160px";
  const HEAD = ["COVER", "TITLE", "CATEGORY", "LIKES", "COMMENTS", "DATE", "STATUS", "ACTIONS"];

  const resetForm = () => setForm(emptyForm());

  const openEdit = (p: PostData) => {
    setForm({
      title: p.title,
      body: p.body || "",
      cat: p.cat,
      schedule: "",
      mode: "publish",
      coverImage: p.img || "",
    });
    setEditTarget(p);
  };

  const handleCreate = async (asDraft = false) => {
    try {
      await createPost({
        ...toPayload(form, asDraft ? "Draft" : form.mode === "schedule" ? "Scheduled" : "Published"),
      }).unwrap();
      setCreateModal(false);
      resetForm();
      showToast(asDraft ? "Post saved as draft" : form.mode === "schedule" ? "Post scheduled!" : "Post published!");
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to save post", "error");
    }
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    try {
      await updatePost({
        id: editTarget.id,
        data: toPayload(form, editTarget.status),
      }).unwrap();
      setEditTarget(null);
      showToast("Post updated successfully!");
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to update post", "error");
    }
  };

  return <div style={{ padding: "28px 32px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
      <div>
        <h2 style={{ fontFamily: P, fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Posts</h2>
        <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>
          {posts.length} TOTAL · {posts.filter((p) => p.status === "Published").length} PUBLISHED
          {(isLoading || isFetching) ? " · SYNCING..." : ""}
        </div>
      </div>
    </div>

    <ACard style={{ padding: "20px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 9, padding: "8px 14px", width: 300 }}>
          <Search size={14} color={C.td} />
          <input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: "none", border: "none", outline: "none", fontFamily: P, fontSize: 13, color: C.t1, width: "100%" }}
          />
        </div>
        <div style={{ width: 1, height: 24, background: AD.cardB }} />
        <ASel value={catFilter} onChange={setCatFilter} opts={[{ l: "All Categories", v: "All Categories" }, { l: "Market Update", v: "Market Update" }, { l: "Education", v: "Education" }, { l: "News", v: "News" }, { l: "Announcement", v: "Announcement" }]} />
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <AGhost icon={<RefreshCw size={14} />} onClick={() => refetch()}>Refresh</AGhost>
        <APrimary onClick={() => { resetForm(); setCreateModal(true); }} icon={<Plus size={14} />}>Create Post</APrimary>
      </div>
    </ACard>

    <ACard>
      <div style={{ display: "grid", gridTemplateColumns: COLS, padding: "16px 28px", background: AD.nav, position: "sticky", top: 0, zIndex: 10, borderRadius: "18px 18px 0 0", borderBottom: `1px solid ${AD.cardB}` }}>
        {HEAD.map((h) => <span key={h} style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>{h}</span>)}
      </div>
      {!isLoading && posts.length === 0 && (
        <div style={{ padding: "48px 28px", textAlign: "center", fontFamily: P, fontSize: 14, color: C.td }}>
          No posts found.
        </div>
      )}
      {posts.map((post, i) => <div key={post.id} className="a-row" style={{ display: "grid", gridTemplateColumns: COLS, padding: "24px 28px", borderBottom: i < posts.length - 1 ? `1px solid ${AD.cardB}` : "none", alignItems: "center" }}>
        <div style={{ width: 64, height: 44, borderRadius: 10, background: C.surface, overflow: "hidden", flexShrink: 0 }}>
          {post.img ? <img src={post.img} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Image size={18} color={C.td} /></div>}
        </div>
        <div style={{ paddingRight: 24 }}>
          <div style={{ fontFamily: P, fontSize: 15, fontWeight: 600, color: C.t1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 4 }}>{post.title}</div>
        </div>
        <span style={{ fontFamily: P, fontSize: 13, color: catCol[post.cat] || C.tm }}>{post.cat}</span>
        <span style={{ fontFamily: M, fontSize: 14, color: C.t2 }}>{post.likes}</span>
        <span style={{ fontFamily: M, fontSize: 14, color: C.t2 }}>{post.comments}</span>
        <span style={{ fontFamily: M, fontSize: 12, color: C.td }}>{post.date}</span>
        <div><Chip label={post.status} type={post.status === "Published" ? "ok" : "draft"} /></div>
        <div style={{ display: "flex", gap: 6 }}>
          <IconBtn icon={<Eye size={14} color={C.t2} />} title="Preview" onClick={() => setPreviewTarget(post)} />
          <IconBtn icon={<Pencil size={14} color={C.t2} />} title="Edit" onClick={() => openEdit(post)} />
          {post.status === "Draft" && <IconBtn icon={<Send size={14} color={C.buy} />} title="Publish" onClick={() => setPublishTarget(post)} bg="rgba(0,208,132,0.08)" />}
          {post.status === "Draft" && <IconBtn icon={<Calendar size={14} color="#60A5FA" />} title="Schedule" onClick={() => { setScheduleDate(""); setScheduleTarget(post); }} bg="rgba(96,165,250,0.08)" />}
          <IconBtn icon={<Trash2 size={14} color={C.sell} />} title="Delete" onClick={() => setDeleteTarget(post)} />
        </div>
      </div>)}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", borderTop: `1px solid ${AD.cardB}`, background: AD.nav, borderRadius: "0 0 18px 18px" }}>
        <span style={{ fontFamily: P, fontSize: 12, color: C.td }}>Showing 1 to {posts.length} of {posts.length} records</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.td }}><ChevronLeft size={16} /></button>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: C.brand, border: `1px solid ${C.brand}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", fontFamily: P, fontSize: 13, fontWeight: 600 }}>1</button>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: AD.inp, border: `1px solid ${AD.inpB}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.td }}><ChevronRight size={16} /></button>
        </div>
      </div>
    </ACard>

    {createModal && <AModal title="Create Post" sub="Publish to the mobile app Posts feed" onClose={() => setCreateModal(false)} width={680}>
      <PostFormFields form={form} setForm={setForm} />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 16 }}>
        <AGhost onClick={() => setCreateModal(false)}>Cancel</AGhost>
        <AGhost icon={<FileText size={13} />} loading={loading} onClick={() => handleCreate(true)}>Save Draft</AGhost>
        <APrimary icon={<BookOpen size={13} />} loading={loading} onClick={() => handleCreate(false)}>{form.mode === "schedule" ? "Schedule Post" : "Publish Post"}</APrimary>
      </div>
    </AModal>}

    {editTarget && <AModal title="Edit Post" sub={`Editing: ${editTarget.title}`} onClose={() => setEditTarget(null)} width={680}>
      <PostFormFields form={form} setForm={setForm} />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 16 }}>
        <AGhost onClick={() => setEditTarget(null)}>Cancel</AGhost>
        <APrimary icon={<BookOpen size={13} />} loading={loading} onClick={handleUpdate}>Save Changes</APrimary>
      </div>
    </AModal>}

    {previewTarget && <AModal title="Post Preview" sub={previewTarget.cat} onClose={() => setPreviewTarget(null)} width={640}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {previewTarget.img && <div style={{ borderRadius: 12, overflow: "hidden", height: 200 }}><img src={previewTarget.img} alt={previewTarget.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>}
        <div style={{ fontFamily: P, fontSize: 22, fontWeight: 700, color: C.t1, lineHeight: 1.3 }}>{previewTarget.title}</div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Chip label={previewTarget.cat} type="brand" />
          <span style={{ fontFamily: M, fontSize: 12, color: C.td }}>{previewTarget.date}</span>
          <Chip label={previewTarget.status} type={previewTarget.status === "Published" ? "ok" : "draft"} />
        </div>
        <div style={{ fontFamily: P, fontSize: 14, color: C.t2, lineHeight: 1.7 }}>{previewTarget.body || "No content yet."}</div>
        <div style={{ display: "flex", gap: 24, padding: "16px 0", borderTop: `1px solid ${AD.cardB}` }}>
          <span style={{ fontFamily: P, fontSize: 13, color: C.tm }}>❤️ {previewTarget.likes} likes</span>
          <span style={{ fontFamily: P, fontSize: 13, color: C.tm }}>💬 {previewTarget.comments} comments</span>
        </div>
      </div>
    </AModal>}

    {scheduleTarget && <AModal title="Schedule Post" sub={`Schedule: ${scheduleTarget.title}`} onClose={() => setScheduleTarget(null)} width={440}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: `${C.brand}0A`, border: `1px solid ${C.brand}20`, borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ fontFamily: P, fontSize: 14, fontWeight: 600, color: C.t1 }}>{scheduleTarget.title}</div>
          <div style={{ fontFamily: P, fontSize: 11, color: C.tm, marginTop: 4 }}>Category: {scheduleTarget.cat}</div>
        </div>
        <AIn label="Schedule Date & Time" placeholder="Select date and time" value={scheduleDate} onChange={setScheduleDate} type="datetime-local" />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <AGhost onClick={() => setScheduleTarget(null)}>Cancel</AGhost>
          <APrimary icon={<Calendar size={13} />} loading={loading} onClick={async () => {
            try {
              await schedulePost({ id: scheduleTarget.id, scheduledAt: new Date(scheduleDate).toISOString() }).unwrap();
              setScheduleTarget(null);
              showToast("Post scheduled successfully!");
            } catch (error: any) {
              showToast(error?.data?.message || "Failed to schedule post", "error");
            }
          }}>Schedule</APrimary>
        </div>
      </div>
    </AModal>}

    {deleteTarget && <ConfirmDeleteModal
      message={`Are you sure you want to delete <strong>"${deleteTarget.title}"</strong>? This will permanently remove the post and all associated likes and comments. This action cannot be undone.`}
      loading={loading}
      onCancel={() => setDeleteTarget(null)}
      onConfirm={async () => {
        try {
          await deletePost(deleteTarget.id).unwrap();
          setDeleteTarget(null);
          showToast("Post deleted", "error");
        } catch (error: any) {
          showToast(error?.data?.message || "Failed to delete post", "error");
        }
      }}
    />}

    {publishTarget && <ConfirmActionModal
      title={`Publish "${publishTarget.title}"?`}
      message="This will immediately publish this post and send a push notification to all subscribers. The post will appear in the mobile app's Posts feed."
      confirmLabel="Publish Now"
      icon={<Send size={28} color={C.buy} />}
      iconColor={C.buy}
      iconBg="rgba(0,208,132,0.1)"
      loading={loading}
      onCancel={() => setPublishTarget(null)}
      onConfirm={async () => {
        try {
          await publishPost(publishTarget.id).unwrap();
          setPublishTarget(null);
          showToast("Post published!");
        } catch (error: any) {
          showToast(error?.data?.message || "Failed to publish post", "error");
        }
      }}
    />}
  </div>;
}
