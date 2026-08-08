/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2, Check, Loader2 } from "lucide-react";
import { C, P, M, AD, APrimary, AGhost, AIn, ACard, PLAN_SIGNAL_TYPE_OPTIONS } from "./shared";
import { useToast } from "./SuccessToast";
import {
  useGetAllSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from "../../store/api/subscriptionApi";
import { useGetSignalTypesQuery } from "../../store/api/signalTypeApi";

interface FeaturePoint {
  id: string;
  text: string;
  enabled: boolean;
}

const DEFAULT_SUGGESTED_FEATURES = [
  "All signal types: Scalp, Swing, and Long-term",
  "Up to 10 signals per day (Forex & Crypto)",
  "Up to 5 daily signals",
  "3–5 Swing signals per week",
  "Entry/Exit alerts with Stop-Loss protection",
  "Daily Gold (Metals) signals",
  "Advanced technical analysis reports for Forex & Crypto markets",
  "Market sentiment analysis",
  "Economic calendar updates (news & events)",
  "Real-time notifications",
  "Access to major Forex pairs",
  "Access to major Crypto pairs",
  "24/7 Premium Support",
  "Advanced support",
  "Early access to new features",
  "Cancel anytime • No commitment required",
];

export default function EditSubscriptionPlan() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const { showToast } = useToast();

  const { data: apiResponse, isLoading: isFetchingPlans } = useGetAllSubscriptionsQuery();
  const { data: signalTypesResponse, isLoading: isFetchingTypes } = useGetSignalTypesQuery();
  const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation();
  const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation();

  // Form states (Only backend fields)
  const [name, setName] = useState("");
  const [monthly, setMonthly] = useState("49");
  const [yearly, setYearly] = useState("469");
  const [maxSignalsPerDay, setMaxSignalsPerDay] = useState("10");
  const [selectedSignalTypes, setSelectedSignalTypes] = useState<string[]>(["Scalp", "Swing"]);

  // Feature points states
  const [featurePoints, setFeaturePoints] = useState<FeaturePoint[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState("");
  const [rawPlanId, setRawPlanId] = useState<string | null>(null);

  const signalTypeOptions = (signalTypesResponse?.data || []).length
    ? (signalTypesResponse?.data || [])
        .filter((type) => type.isActive)
        .map((type) => ({ key: type.name, label: type.name }))
    : [...PLAN_SIGNAL_TYPE_OPTIONS].map((type) => ({
        key: type.label,
        label: type.label,
      }));

  const normalizeTypeName = (value: string) => {
    const match = signalTypeOptions.find(
      (option) => option.key.toLowerCase() === value.toLowerCase(),
    );
    return match?.key || value.charAt(0).toUpperCase() + value.slice(1);
  };
  const nameLower = name.toLowerCase();
  let staticEmoji = "⭐";
  let staticColor = C.brand;

  if (nameLower.includes("vip")) {
    staticEmoji = "👑";
    staticColor = C.brand;
  } else if (nameLower.includes("forex")) {
    staticEmoji = "💱";
    staticColor = C.gold;
  } else if (nameLower.includes("crypto")) {
    staticEmoji = "₿";
    staticColor = "#60A5FA";
  }

  // Initialize or populate data
  useEffect(() => {
    if (isEditing && apiResponse?.data) {
      const foundPlan = apiResponse.data.find(
        (p) => p._id === id || p.id === id || p.name.toLowerCase() === id?.toLowerCase()
      );

      if (foundPlan) {
        setRawPlanId(foundPlan._id || null);
        setName(foundPlan.name || "");
        setMonthly(foundPlan.monthly ? String(foundPlan.monthly) : String(foundPlan.price || "49"));
        setYearly(foundPlan.yearly ? String(foundPlan.yearly) : String((foundPlan.price ? foundPlan.price * 10 : 469)));
        setMaxSignalsPerDay(String(foundPlan.maxSignalsPerDay ?? 10));
        setSelectedSignalTypes(
          (foundPlan.signalTypes && foundPlan.signalTypes.length
            ? foundPlan.signalTypes
            : ["Scalp", "Swing"]
          ).map(normalizeTypeName),
        );

        // Build feature points
        const existingFeatures = foundPlan.features || [];
        const existingSet = new Set(existingFeatures.map((f) => f.trim()));
        const points: FeaturePoint[] = [];

        existingFeatures.forEach((f, idx) => {
          points.push({ id: `exist-${idx}-${Date.now()}`, text: f, enabled: true });
        });

        DEFAULT_SUGGESTED_FEATURES.forEach((suggested, idx) => {
          if (!existingSet.has(suggested)) {
            points.push({ id: `sug-${idx}`, text: suggested, enabled: false });
          }
        });

        setFeaturePoints(points);
      }
    } else if (!isEditing) {
      // Default feature points for Create Plan
      const points: FeaturePoint[] = DEFAULT_SUGGESTED_FEATURES.map((f, idx) => ({
        id: `sug-${idx}`,
        text: f,
        enabled: idx < 4,
      }));
      setFeaturePoints(points);
      setMaxSignalsPerDay("10");
      setSelectedSignalTypes(
        signalTypeOptions.length
          ? signalTypeOptions.map((type) => type.key)
          : ["Scalp", "Swing", "Intraday", "Position", "Long-term"],
      );
    }
  }, [id, isEditing, apiResponse, signalTypesResponse]);

  const toggleSignalType = (typeKey: string) => {
    setSelectedSignalTypes((prev) =>
      prev.some((item) => item.toLowerCase() === typeKey.toLowerCase())
        ? prev.filter((item) => item.toLowerCase() !== typeKey.toLowerCase())
        : [...prev, typeKey],
    );
  };

  const handleAddCustomFeature = () => {
    if (!newFeatureInput || !newFeatureInput.trim()) return;
    const newPoint: FeaturePoint = {
      id: `custom-${Date.now()}`,
      text: newFeatureInput.trim(),
      enabled: true,
    };
    setFeaturePoints((prev) => [...prev, newPoint]);
    setNewFeatureInput("");
    showToast("Custom feature added to point list!", "info");
  };

  const toggleFeaturePoint = (pointId: string) => {
    setFeaturePoints((prev) =>
      prev.map((f) => (f.id === pointId ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const removeFeaturePoint = (pointId: string) => {
    setFeaturePoints((prev) => prev.filter((f) => f.id !== pointId));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast("Plan name is required!", "warning");
      return;
    }

    const activeFeatures = featurePoints
      .filter((f) => f.enabled && f.text.trim())
      .map((f) => f.text.trim());

    if (activeFeatures.length === 0) {
      showToast("Please enable at least one feature point!", "warning");
      return;
    }

    if (selectedSignalTypes.length === 0) {
      showToast("Please select at least one signal type for this plan!", "warning");
      return;
    }

    const planPayload = {
      name,
      price: Number(monthly) || 49,
      monthly,
      yearly,
      features: activeFeatures,
      maxSignalsPerDay: Number(maxSignalsPerDay) || 10,
      signalTypes: selectedSignalTypes,
    };

    if (isEditing) {
      const targetId = rawPlanId || id;
      if (targetId) {
        try {
          await updateSubscription({
            id: targetId,
            data: planPayload,
          }).unwrap();
          showToast("Subscription plan updated successfully!", "success");
          navigate("/subscriptions");
        } catch (err: any) {
          showToast(err?.data?.message || "Failed to update subscription plan", "error");
        }
      } else {
        showToast("Plan updated successfully!", "success");
        navigate("/subscriptions");
      }
    } else {
      try {
        await createSubscription({
          ...planPayload,
          description: `${name} trading signals subscription plan`,
        }).unwrap();
        showToast("Subscription plan created successfully!", "success");
        navigate("/subscriptions");
      } catch (err: any) {
        showToast(err?.data?.message || "Failed to create subscription plan", "error");
      }
    }
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1000, margin: "0 auto" }}>
      {/* Top Bar / Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <button
          onClick={() => navigate("/subscriptions")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            background: AD.inp,
            border: `1px solid ${AD.inpB}`,
            borderRadius: 9,
            fontFamily: P,
            fontSize: 13,
            fontWeight: 500,
            color: C.t1,
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={16} color={C.tm} /> Back to Subscription Plans
        </button>

        <div style={{ display: "flex", gap: 12 }}>
          <AGhost onClick={() => navigate("/subscriptions")}>Cancel</AGhost>
          <APrimary
            onClick={handleSave}
            disabled={isCreating || isUpdating || isFetchingPlans || isFetchingTypes}
            icon={isCreating || isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          >
            {isCreating || isUpdating ? "Saving..." : isEditing ? "Save Changes" : "Create Subscription Plan"}
          </APrimary>
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: P, fontSize: 24, fontWeight: 700, color: C.t1, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
          {isEditing ? `Edit Plan — ${name}` : "Create New Subscription Plan"}
        </h2>
        <div style={{ fontFamily: P, fontSize: 13, color: C.tm }}>
          Configure pricing details and point-by-point feature highlights.
        </div>
      </div>

      {isFetchingPlans && isEditing ? (
        <div style={{ padding: 80, textAlign: "center", color: C.tm, fontFamily: P, fontSize: 14 }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto 12px", color: C.brand }} />
          Loading plan details...
        </div>
      ) : (
        <form onSubmit={handleSave} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
          {/* Left Column: Basic Plan Configuration */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <ACard style={{ padding: "24px 28px" }}>
              <div style={{ fontFamily: P, fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 16, borderBottom: `1px solid ${AD.cardB}`, paddingBottom: 12 }}>
                Plan Information
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <AIn
                  label="Plan Name"
                  placeholder="e.g. VIP Plan or Forex Pro"
                  value={name}
                  onChange={setName}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <AIn
                    label="Monthly Price ($)"
                    placeholder="49"
                    value={monthly}
                    onChange={setMonthly}
                    type="number"
                  />
                  <AIn
                    label="Yearly Price ($)"
                    placeholder="469"
                    value={yearly}
                    onChange={setYearly}
                    type="number"
                  />
                </div>
              </div>
            </ACard>

            <ACard style={{ padding: "24px 28px" }}>
              <div style={{ fontFamily: P, fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 16, borderBottom: `1px solid ${AD.cardB}`, paddingBottom: 12 }}>
                Signal Access Settings
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <AIn
                  label="Max Signals Per Day"
                  placeholder="10"
                  value={maxSignalsPerDay}
                  onChange={setMaxSignalsPerDay}
                  type="number"
                />

                <div>
                  <div style={{ fontFamily: P, fontSize: 11, fontWeight: 600, color: C.tm, letterSpacing: "0.06em", marginBottom: 10 }}>
                    ALLOWED SIGNAL TYPES
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {signalTypeOptions.map((typeOption) => {
                      const enabled = selectedSignalTypes.some(
                        (type) => type.toLowerCase() === typeOption.key.toLowerCase(),
                      );
                      return (
                        <div
                          key={typeOption.key}
                          onClick={() => toggleSignalType(typeOption.key)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 14px",
                            background: enabled ? "rgba(128,0,255,0.08)" : "rgba(255,255,255,0.015)",
                            border: `1px solid ${enabled ? "rgba(128,0,255,0.25)" : AD.cardB}`,
                            borderRadius: 10,
                            cursor: "pointer",
                            opacity: enabled ? 1 : 0.55,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: 5,
                                border: `1px solid ${enabled ? C.brand : AD.inpB}`,
                                background: enabled ? C.brand : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {enabled && <Check size={12} color="#fff" strokeWidth={3} />}
                            </div>
                            <span style={{ fontFamily: P, fontSize: 13, color: enabled ? C.t1 : C.tm }}>
                              {typeOption.label}
                            </span>
                          </div>
                          <span
                            style={{
                              fontFamily: M,
                              fontSize: 10,
                              padding: "3px 9px",
                              borderRadius: 100,
                              background: enabled ? "rgba(0,208,132,0.12)" : "rgba(100,116,139,0.12)",
                              color: enabled ? C.buy : C.closed,
                              fontWeight: 600,
                            }}
                          >
                            {enabled ? "Included" : "Excluded"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ACard>

            {/* Live Preview Card */}
            <ACard style={{ padding: "24px 28px", border: `1px solid ${staticColor}33`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: staticColor }} />
              <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.12em", marginBottom: 14 }}>
                CARD PREVIEW (STATIC THEME)
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${staticColor}20`, border: `1px solid ${staticColor}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                  {staticEmoji}
                </div>
                <div>
                  <div style={{ fontFamily: P, fontSize: 16, fontWeight: 700, color: C.t1 }}>{name || "Untitled Plan"}</div>
                  <div style={{ fontFamily: M, fontSize: 16, fontWeight: 700, color: staticColor }}>${monthly || "0"} / month</div>
                </div>
              </div>
              <div style={{ fontFamily: P, fontSize: 12, color: C.tm }}>
                Includes {featurePoints.filter((f) => f.enabled).length} active feature points.
              </div>
            </ACard>
          </div>

          {/* Right Column: Point-by-Point Feature Management */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <ACard style={{ padding: "24px 28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: `1px solid ${AD.cardB}`, paddingBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: P, fontSize: 15, fontWeight: 700, color: C.t1 }}>
                    Point-by-Point Features
                  </div>
                  <div style={{ fontFamily: P, fontSize: 11, color: C.tm, marginTop: 2 }}>
                    Click checkboxes to enable or disable features for this plan.
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: M,
                    fontSize: 11,
                    color: C.brand,
                    background: "rgba(128,0,255,0.12)",
                    border: "1px solid rgba(128,0,255,0.25)",
                    padding: "4px 10px",
                    borderRadius: 100,
                    fontWeight: 600,
                  }}
                >
                  {featurePoints.filter((f) => f.enabled).length} Active Points
                </span>
              </div>

              {/* Add Custom Feature (+ Button) */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <input
                  type="text"
                  value={newFeatureInput}
                  onChange={(e) => setNewFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomFeature();
                    }
                  }}
                  placeholder="Type a new feature point..."
                  style={{
                    flex: 1,
                    background: AD.inp,
                    border: `1px solid ${AD.inpB}`,
                    borderRadius: 9,
                    padding: "9px 13px",
                    fontFamily: P,
                    fontSize: 13,
                    color: C.t1,
                    outline: "none",
                  }}
                />
                <button
                  onClick={handleAddCustomFeature}
                  type="button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 16px",
                    background: C.brand,
                    border: "none",
                    borderRadius: 9,
                    fontFamily: P,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#fff",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Plus size={16} /> Add Feature
                </button>
              </div>

              {/* Feature Points List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 420, overflowY: "auto", paddingRight: 4 }}>
                {featurePoints.map((feat) => (
                  <div
                    key={feat.id}
                    onClick={() => toggleFeaturePoint(feat.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: feat.enabled ? "rgba(128,0,255,0.08)" : "rgba(255,255,255,0.015)",
                      border: `1px solid ${feat.enabled ? "rgba(128,0,255,0.25)" : AD.cardB}`,
                      borderRadius: 10,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      opacity: feat.enabled ? 1 : 0.45,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 5,
                          border: `1px solid ${feat.enabled ? C.brand : AD.inpB}`,
                          background: feat.enabled ? C.brand : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.15s",
                        }}
                      >
                        {feat.enabled && <Check size={12} color="#fff" strokeWidth={3} />}
                      </div>
                      <span
                        style={{
                          fontFamily: P,
                          fontSize: 13,
                          color: feat.enabled ? C.t1 : C.tm,
                          fontWeight: feat.enabled ? 500 : 400,
                          textDecoration: feat.enabled ? "none" : "line-through",
                        }}
                      >
                        {feat.text}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span
                        style={{
                          fontFamily: M,
                          fontSize: 10,
                          padding: "3px 9px",
                          borderRadius: 100,
                          background: feat.enabled ? "rgba(0,208,132,0.12)" : "rgba(100,116,139,0.12)",
                          color: feat.enabled ? C.buy : C.closed,
                          fontWeight: 600,
                        }}
                      >
                        {feat.enabled ? "Enabled" : "Disabled"}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFeaturePoint(feat.id);
                        }}
                        type="button"
                        style={{
                          background: "none",
                          border: "none",
                          color: C.td,
                          cursor: "pointer",
                          padding: 4,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Trash2 size={14} color={C.sell} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </ACard>
          </div>
        </form>
      )}
    </div>
  );
}
