import { useMemo, useState } from "react";
import {
  Bell, Calendar, Filter, Activity, CheckCircle, Pencil, Trash2, Eye, Send,
} from "lucide-react";
import {
  C, P, M, AD, APrimary, AGhost, AIn, ATa, ASel, AModal, ACard, IconBtn,
  NotifData,
} from "./shared";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { useToast } from "./SuccessToast";
import {
  mapApiNotification,
  useDeleteNotificationMutation,
  useGetAudienceStatsQuery,
  useGetNotificationsQuery,
  useScheduleNotificationMutation,
  useSendNotificationMutation,
  useUpdateNotificationMutation,
} from "../../store/api/notificationApi";
import { getTodayDateTimeLocal } from "../utils/signalDate";

const emptyNotifForm = () => ({
  title: "",
  msg: "",
  audience: "All Users",
  schedule: getTodayDateTimeLocal(),
});

export default function ANotifications() {
  const { showToast } = useToast();
  const [form, setForm] = useState(emptyNotifForm());
  const [sent, setSent] = useState(false);
  const [editTarget, setEditTarget] = useState<NotifData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NotifData | null>(null);
  const [previewTarget, setPreviewTarget] = useState<NotifData | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetNotificationsQuery();
  const { data: audienceData } = useGetAudienceStatsQuery();
  const [sendNotification, { isLoading: sending }] = useSendNotificationMutation();
  const [scheduleNotification, { isLoading: scheduling }] = useScheduleNotificationMutation();
  const [updateNotification, { isLoading: updating }] = useUpdateNotificationMutation();
  const [deleteNotification, { isLoading: deleting }] = useDeleteNotificationMutation();

  const loading = sending || scheduling || updating || deleting;
  const stats = audienceData?.data;

  const audOpts = [
    { l: `All Users (${stats?.all ?? 0})`, v: "All Users" },
    { l: `VIP Members (${stats?.vip ?? 0})`, v: "VIP Users" },
    { l: `Forex Members (${stats?.forex ?? 0})`, v: "Forex Users" },
    { l: `Crypto Members (${stats?.crypto ?? 0})`, v: "Crypto Users" },
    { l: `Trial Users (${stats?.trial ?? 0})`, v: "Trial Users" },
  ];

  const notifs = useMemo(
    () => (data?.data || []).map(mapApiNotification),
    [data?.data],
  );

  const COLS = "minmax(200px,1fr) 140px 140px 100px 120px 120px";
  const HEAD = ["TITLE", "AUDIENCE", "SENT", "REACH", "OPEN RATE", "ACTIONS"];

  const handleSend = async () => {
    try {
      await sendNotification({
        title: form.title,
        message: form.msg,
        audience: form.audience,
      }).unwrap();
      setSent(true);
      showToast(`Notification sent to ${form.audience}!`);
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to send notification", "error");
    }
  };

  const handleSchedule = async () => {
    if (!form.schedule) {
      showToast("Please select a schedule time", "error");
      return;
    }
    try {
      await scheduleNotification({
        title: form.title,
        message: form.msg,
        audience: form.audience,
        scheduledAt: new Date(form.schedule).toISOString(),
      }).unwrap();
      showToast("Notification scheduled");
      setForm(emptyNotifForm());
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to schedule notification", "error");
    }
  };

  return <div style={{ padding: "28px 32px" }}>
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontFamily: P, fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Push Notifications</h2>
      <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>
        SEND · SCHEDULE · HISTORY {(isLoading || isFetching) ? "· SYNCING..." : ""}
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "440px 1fr", gap: 24, alignItems: "start" }}>
      <ACard style={{ padding: "24px 28px" }}>
        <div style={{ fontFamily: P, fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 4 }}>Send Notification</div>
        <div style={{ fontFamily: P, fontSize: 12, color: C.tm, marginBottom: 20 }}>Deliver an instant message to your subscribers.</div>
        {sent ? <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(0,208,132,0.1)", border: "1px solid rgba(0,208,132,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><CheckCircle size={28} color={C.buy} /></div>
          <div style={{ fontFamily: P, fontSize: 15, fontWeight: 600, color: C.buy, marginBottom: 6 }}>Notification Sent</div>
          <div style={{ fontFamily: P, fontSize: 13, color: C.tm, marginBottom: 20 }}>Delivered to {form.audience}</div>
          <AGhost onClick={() => { setSent(false); setForm(emptyNotifForm()); }}>Send Another</AGhost>
        </div> : <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <AIn label="Title" placeholder="e.g. New Signal — BTC/USDT" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <ATa label="Message" placeholder="Write the message body…" value={form.msg} onChange={(v) => setForm({ ...form, msg: v })} rows={3} />
          <ASel label="Audience" value={form.audience} onChange={(v) => setForm({ ...form, audience: v })} opts={audOpts} />
          <AIn label="Schedule Time (optional)" placeholder="Leave empty to send now" value={form.schedule} onChange={(v) => setForm({ ...form, schedule: v })} type="datetime-local" />
          {(form.title || form.msg) && <div style={{ background: AD.inp, border: `1px solid ${AD.inpB}`, borderRadius: 11, padding: "16px 18px", marginTop: 8 }}>
            <div style={{ fontFamily: M, fontSize: 9, color: C.td, letterSpacing: "0.12em", marginBottom: 12 }}>PREVIEW</div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: `linear-gradient(135deg,${C.brand},${C.brandH})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Activity size={18} color="#fff" /></div>
              <div>
                <div style={{ fontFamily: P, fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 4 }}>{form.title || "Notification Title"}</div>
                <div style={{ fontFamily: P, fontSize: 12, color: C.tm, lineHeight: 1.45 }}>{form.msg || "Your message here."}</div>
              </div>
            </div>
          </div>}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <APrimary icon={<Bell size={14} />} loading={loading} onClick={handleSend}>Send Now</APrimary>
            <AGhost icon={<Calendar size={14} />} loading={loading} onClick={handleSchedule}>Schedule</AGhost>
          </div>
        </div>}
      </ACard>

      <ACard>
        <div style={{ padding: "20px 28px", borderBottom: `1px solid ${AD.cardB}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: P, fontSize: 15, fontWeight: 700, color: C.t1 }}>Notification History</div>
          <div style={{ display: "flex", gap: 8 }}>
            <AGhost icon={<Filter size={13} />} size="sm" onClick={() => refetch()}>Refresh</AGhost>
          </div>
        </div>
        <div className="a-tscroll" style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 700 }}>
            <div style={{ display: "grid", gridTemplateColumns: COLS, padding: "16px 28px", background: AD.nav, position: "sticky", top: 0, zIndex: 10, borderBottom: `1px solid ${AD.cardB}` }}>
              {HEAD.map((h) => <span key={h} style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em" }}>{h}</span>)}
            </div>
            {!isLoading && notifs.length === 0 && (
              <div style={{ padding: "40px 28px", textAlign: "center", fontFamily: P, fontSize: 14, color: C.td }}>
                No notifications sent yet.
              </div>
            )}
            {notifs.map((n, i) => <div key={n.id} className="a-row" style={{ display: "grid", gridTemplateColumns: COLS, padding: "20px 28px", borderBottom: i < notifs.length - 1 ? `1px solid ${AD.cardB}` : "none", alignItems: "center" }}>
              <span style={{ fontFamily: P, fontSize: 13, fontWeight: 600, color: C.t1 }}>{n.title}</span>
              <span style={{ fontFamily: P, fontSize: 12, color: C.tm }}>{n.audience}</span>
              <span style={{ fontFamily: M, fontSize: 12, color: C.td }}>{n.sent}</span>
              <span style={{ fontFamily: M, fontSize: 13, color: C.t2 }}>{n.reach.toLocaleString()}</span>
              <div>
                <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: C.buy, marginBottom: 2 }}>
                  {n.reach > 0 ? Math.round((n.opened / n.reach) * 100) : 0}%
                </div>
                <div style={{ fontFamily: P, fontSize: 11, color: C.td }}>{n.opened.toLocaleString()} opened</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <IconBtn icon={<Eye size={14} color={C.t2} />} title="Preview" onClick={() => setPreviewTarget(n)} />
                <IconBtn icon={<Pencil size={14} color={C.t2} />} title="Edit" onClick={() => {
                  setForm({ title: n.title, msg: n.message || "", audience: n.audience, schedule: getTodayDateTimeLocal() });
                  setEditTarget(n);
                }} />
                <IconBtn icon={<Trash2 size={14} color={C.sell} />} title="Delete" onClick={() => setDeleteTarget(n)} />
              </div>
            </div>)}
          </div>
        </div>
      </ACard>
    </div>

    {editTarget && <AModal title="Edit Notification" sub={`Editing: ${editTarget.title}`} onClose={() => setEditTarget(null)} width={520}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <AIn label="Title" placeholder="Notification title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <ATa label="Message" placeholder="Write the message body…" value={form.msg} onChange={(v) => setForm({ ...form, msg: v })} rows={3} />
        <ASel label="Audience" value={form.audience} onChange={(v) => setForm({ ...form, audience: v })} opts={audOpts} />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <AGhost onClick={() => setEditTarget(null)}>Cancel</AGhost>
          <APrimary loading={loading} onClick={async () => {
            try {
              await updateNotification({
                id: editTarget.id,
                data: { title: form.title, message: form.msg, audience: form.audience },
              }).unwrap();
              setEditTarget(null);
              showToast("Notification updated!");
            } catch (error: any) {
              showToast(error?.data?.message || "Failed to update notification", "error");
            }
          }}>Save Changes</APrimary>
        </div>
      </div>
    </AModal>}

    {previewTarget && <AModal title="Notification Preview" sub={previewTarget.audience} onClose={() => setPreviewTarget(null)} width={440}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: "#1a1a2e", borderRadius: 16, padding: 20, border: `1px solid ${AD.cardB}` }}>
          <div style={{ fontFamily: M, fontSize: 9, color: C.td, letterSpacing: "0.12em", marginBottom: 16, textAlign: "center" }}>MOBILE PREVIEW</div>
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "14px 16px", display: "flex", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,${C.brand},${C.brandH})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Activity size={20} color="#fff" /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: P, fontSize: 10, color: C.td, marginBottom: 4 }}>Elite Trading</div>
              <div style={{ fontFamily: P, fontSize: 14, fontWeight: 600, color: C.t1, marginBottom: 4 }}>{previewTarget.title}</div>
              <div style={{ fontFamily: P, fontSize: 12, color: C.tm, lineHeight: 1.5 }}>{previewTarget.message || "No message content."}</div>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div style={{ background: AD.inp, borderRadius: 10, padding: "12px", textAlign: "center" }}>
            <div style={{ fontFamily: M, fontSize: 8, color: C.td, letterSpacing: "0.1em", marginBottom: 4 }}>REACH</div>
            <div style={{ fontFamily: M, fontSize: 16, fontWeight: 700, color: C.t1 }}>{previewTarget.reach.toLocaleString()}</div>
          </div>
          <div style={{ background: AD.inp, borderRadius: 10, padding: "12px", textAlign: "center" }}>
            <div style={{ fontFamily: M, fontSize: 8, color: C.td, letterSpacing: "0.1em", marginBottom: 4 }}>OPENED</div>
            <div style={{ fontFamily: M, fontSize: 16, fontWeight: 700, color: C.buy }}>{previewTarget.opened.toLocaleString()}</div>
          </div>
          <div style={{ background: AD.inp, borderRadius: 10, padding: "12px", textAlign: "center" }}>
            <div style={{ fontFamily: M, fontSize: 8, color: C.td, letterSpacing: "0.1em", marginBottom: 4 }}>RATE</div>
            <div style={{ fontFamily: M, fontSize: 16, fontWeight: 700, color: C.brand }}>
              {previewTarget.reach > 0 ? Math.round((previewTarget.opened / previewTarget.reach) * 100) : 0}%
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <AGhost onClick={() => setPreviewTarget(null)}>Close</AGhost>
        </div>
      </div>
    </AModal>}

    {deleteTarget && <ConfirmDeleteModal
      message={`Are you sure you want to delete the notification <strong>"${deleteTarget.title}"</strong>? This will remove it from the notification history. This action cannot be undone.`}
      loading={loading}
      onCancel={() => setDeleteTarget(null)}
      onConfirm={async () => {
        try {
          await deleteNotification(deleteTarget.id).unwrap();
          setDeleteTarget(null);
          showToast("Notification deleted", "error");
        } catch (error: any) {
          showToast(error?.data?.message || "Failed to delete notification", "error");
        }
      }}
    />}
  </div>;
}
