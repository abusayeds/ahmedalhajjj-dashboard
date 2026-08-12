/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2, Check, Loader2 } from "lucide-react";
import { C, P, M, AD, APrimary, AGhost, AIn, ACard, PLAN_SIGNAL_TYPE_OPTIONS, ATog, SIGNAL_CATEGORY_OPTIONS } from "./shared";
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

const SUPPORT_OPTIONS = [
  { value: "basic", label: "Basic" },
  { value: "advanced", label: "Advanced" },
  { value: "premium", label: "Premium" },
] as const;

const PAGE_PAD = "16px 20px 48px";
const CARD_PAD = "16px 18px";
const COL_GAP = 14;
const FIELD_GAP = 12;

const cardTitleStyle: React.CSSProperties = {
  fontFamily: P,
  fontSize: 14,
  fontWeight: 700,
  color: C.t1,
  marginBottom: 12,
  borderBottom: `1px solid ${AD.cardB}`,
  paddingBottom: 10,
};

const toggleRowStyle = (enabled: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "9px 12px",
  background: enabled ? "rgba(128,0,255,0.06)" : "rgba(255,255,255,0.015)",
  border: `1px solid ${enabled ? "rgba(128,0,255,0.2)" : AD.cardB}`,
  borderRadius: 8,
});

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
  const [description, setDescription] = useState("");
  const [monthly, setMonthly] = useState("49");
  const [yearly, setYearly] = useState("469");
  const [yearlyEnabled, setYearlyEnabled] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [maxSignalsPerDay, setMaxSignalsPerDay] = useState("10");
  const [selectedSignalTypes, setSelectedSignalTypes] = useState<string[]>(["Scalp", "Swing"]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Forex", "Crypto", "Commodity", "Index"]);
  const [includesGoldSignals, setIncludesGoldSignals] = useState(false);
  const [includesTechnicalAnalysis, setIncludesTechnicalAnalysis] = useState(false);
  const [includesMarketSentiment, setIncludesMarketSentiment] = useState(false);
  const [includesEconomicCalendar, setIncludesEconomicCalendar] = useState(false);
  const [support, setSupport] = useState("basic");

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
        const planNameLower = (foundPlan.name || "").toLowerCase();
        setRawPlanId(foundPlan._id || null);
        setName(foundPlan.name || "");
        setDescription(foundPlan.description || "");
        setMonthly(foundPlan.monthly ? String(foundPlan.monthly) : String(foundPlan.price || "49"));
        setYearly(foundPlan.yearly ? String(foundPlan.yearly) : String((foundPlan.price ? foundPlan.price * 10 : 469)));
        setYearlyEnabled(foundPlan.yearlyEnabled !== false);
        setIsActive(foundPlan.isActive !== false);
        setMaxSignalsPerDay(String(foundPlan.maxSignalsPerDay ?? 10));
        setSelectedCategories(
          foundPlan.allowedCategories?.length
            ? foundPlan.allowedCategories
            : planNameLower.includes("forex")
              ? ["Forex", "Commodity"]
              : planNameLower.includes("crypto")
                ? ["Crypto"]
                : ["Forex", "Crypto", "Commodity", "Index"],
        );
        setIncludesGoldSignals(foundPlan.includesGoldSignals ?? false);
        setIncludesTechnicalAnalysis(foundPlan.includesTechnicalAnalysis ?? false);
        setIncludesMarketSentiment(foundPlan.includesMarketSentiment ?? false);
        setIncludesEconomicCalendar(foundPlan.includesEconomicCalendar ?? false);
        setSupport(foundPlan.support || "basic");
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
      setYearlyEnabled(true);
    }
  }, [id, isEditing, apiResponse, signalTypesResponse]);

  const toggleSignalType = (typeKey: string) => {
    setSelectedSignalTypes((prev) =>
      prev.some((item) => item.toLowerCase() === typeKey.toLowerCase())
        ? prev.filter((item) => item.toLowerCase() !== typeKey.toLowerCase())
        : [...prev, typeKey],
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
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

    if (selectedCategories.length === 0) {
      showToast("Please select at least one signal category for this plan!", "warning");
      return;
    }

    const planPayload = {
      name,
      description: description.trim() || `${name} trading signals subscription plan`,
      price: Number(monthly) || 49,
      monthly,
      yearly,
      features: activeFeatures,
      maxSignalsPerDay: Number(maxSignalsPerDay) || 10,
      signalTypes: selectedSignalTypes,
      allowedCategories: selectedCategories,
      includesGoldSignals,
      includesTechnicalAnalysis,
      includesMarketSentiment,
      includesEconomicCalendar,
      support,
      yearlyEnabled,
      isActive,
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
        }).unwrap();
        showToast("Subscription plan created successfully!", "success");
        navigate("/subscriptions");
      } catch (err: any) {
        showToast(err?.data?.message || "Failed to create subscription plan", "error");
      }
    }
  };

  return (
    <div
      style={{
        padding: PAGE_PAD,
        maxWidth: 1180,
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Top Bar / Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
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
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontFamily: P, fontSize: 20, fontWeight: 700, color: C.t1, margin: "0 0 4px", letterSpacing: "-0.3px" }}>
          {isEditing ? `Edit Plan — ${name}` : "Create New Subscription Plan"}
        </h2>
        <div style={{ fontFamily: P, fontSize: 12, color: C.tm, lineHeight: 1.5 }}>
          Configure pricing, signal access, premium features, and point-by-point highlights.
          {isEditing && (
            <span style={{ display: "block", marginTop: 4, color: C.gold, fontSize: 11 }}>
              Plan edits apply to new purchases only. Existing subscribers keep the benefits from when they subscribed.
            </span>
          )}
        </div>
      </div>

      {isFetchingPlans && isEditing ? (
        <div style={{ padding: 48, textAlign: "center", color: C.tm, fontFamily: P, fontSize: 13 }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto 12px", color: C.brand }} />
          Loading plan details...
        </div>
      ) : (
        <form
          onSubmit={handleSave}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: COL_GAP,
            alignItems: "start",
          }}
        >
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: COL_GAP, minWidth: 0 }}>
            <ACard style={{ padding: CARD_PAD }}>
              <div style={cardTitleStyle}>Plan Information</div>

              <div style={{ display: "flex", flexDirection: "column", gap: FIELD_GAP }}>
                <AIn
                  label="Plan Name"
                  placeholder="e.g. VIP Plan or Forex Pro"
                  value={name}
                  onChange={setName}
                />

                <div>
                  <div style={{ fontFamily: P, fontSize: 11, fontWeight: 600, color: C.tm, letterSpacing: "0.06em", marginBottom: 8 }}>
                    DESCRIPTION
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short plan description shown in the app"
                    rows={3}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      background: AD.inp,
                      border: `1px solid ${AD.inpB}`,
                      borderRadius: 9,
                      padding: "10px 13px",
                      fontFamily: P,
                      fontSize: 13,
                      color: C.t1,
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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

                <div style={toggleRowStyle(yearlyEnabled)}>
                  <div>
                    <div style={{ fontFamily: P, fontSize: 12, fontWeight: 600, color: C.t1 }}>Yearly Billing</div>
                    <div style={{ fontFamily: P, fontSize: 11, color: C.tm, marginTop: 2 }}>
                      {yearlyEnabled
                        ? "Users can subscribe on a yearly cycle."
                        : "Yearly billing is hidden for this plan."}
                    </div>
                  </div>
                  <ATog on={yearlyEnabled} onChange={setYearlyEnabled} />
                </div>

                <div style={toggleRowStyle(isActive)}>
                  <div>
                    <div style={{ fontFamily: P, fontSize: 12, fontWeight: 600, color: C.t1 }}>Plan Active</div>
                    <div style={{ fontFamily: P, fontSize: 11, color: C.tm, marginTop: 2 }}>
                      {isActive
                        ? "Visible and available for new subscriptions."
                        : "Hidden from new users."}
                    </div>
                  </div>
                  <ATog on={isActive} onChange={setIsActive} />
                </div>
              </div>
            </ACard>

            <ACard style={{ padding: CARD_PAD }}>
              <div style={cardTitleStyle}>Signal Access Settings</div>

              <div style={{ display: "flex", flexDirection: "column", gap: FIELD_GAP }}>
                <AIn
                  label="Max Signals Per Day"
                  placeholder="10"
                  value={maxSignalsPerDay}
                  onChange={setMaxSignalsPerDay}
                  type="number"
                />

                <div>
                  <div style={{ fontFamily: P, fontSize: 11, fontWeight: 600, color: C.tm, letterSpacing: "0.06em", marginBottom: 10 }}>
                    ALLOWED CATEGORIES
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {SIGNAL_CATEGORY_OPTIONS.map((category) => {
                      const enabled = selectedCategories.includes(category.value);
                      return (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => toggleCategory(category.value)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 100,
                            border: `1px solid ${enabled ? C.brand : AD.inpB}`,
                            background: enabled ? "rgba(128,0,255,0.12)" : AD.inp,
                            color: enabled ? C.brand : C.tm,
                            fontFamily: P,
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {category.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: P, fontSize: 11, fontWeight: 600, color: C.tm, letterSpacing: "0.06em", marginBottom: 8 }}>
                    ALLOWED SIGNAL TYPES
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {signalTypeOptions.map((typeOption) => {
                      const enabled = selectedSignalTypes.some(
                        (type) => type.toLowerCase() === typeOption.key.toLowerCase(),
                      );
                      return (
                        <div
                          key={typeOption.key}
                          onClick={() => toggleSignalType(typeOption.key)}
                          style={{
                            ...toggleRowStyle(enabled),
                            cursor: "pointer",
                            opacity: enabled ? 1 : 0.6,
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

            <ACard style={{ padding: CARD_PAD }}>
              <div style={cardTitleStyle}>Premium Features & Support</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Gold Signals", value: includesGoldSignals, onChange: setIncludesGoldSignals },
                  { label: "Technical Analysis", value: includesTechnicalAnalysis, onChange: setIncludesTechnicalAnalysis },
                  { label: "Market Sentiment", value: includesMarketSentiment, onChange: setIncludesMarketSentiment },
                  { label: "Economic Calendar", value: includesEconomicCalendar, onChange: setIncludesEconomicCalendar },
                ].map((item) => (
                  <div key={item.label} style={toggleRowStyle(item.value)}>
                    <span style={{ fontFamily: P, fontSize: 12, color: C.t1 }}>{item.label}</span>
                    <ATog on={item.value} onChange={item.onChange} />
                  </div>
                ))}

                <div style={{ marginTop: 4 }}>
                  <div style={{ fontFamily: P, fontSize: 11, fontWeight: 600, color: C.tm, letterSpacing: "0.06em", marginBottom: 6 }}>
                    SUPPORT LEVEL
                  </div>
                  <select
                    value={support}
                    onChange={(e) => setSupport(e.target.value)}
                    style={{
                      width: "100%",
                      background: AD.inp,
                      border: `1px solid ${AD.inpB}`,
                      borderRadius: 8,
                      padding: "8px 12px",
                      fontFamily: P,
                      fontSize: 12,
                      color: C.t1,
                      outline: "none",
                    }}
                  >
                    {SUPPORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </ACard>
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: COL_GAP, minWidth: 0 }}>
            <ACard style={{ padding: CARD_PAD }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, borderBottom: `1px solid ${AD.cardB}`, paddingBottom: 10, gap: 10 }}>
                <div>
                  <div style={{ ...cardTitleStyle, marginBottom: 4, borderBottom: "none", paddingBottom: 0 }}>
                    Point-by-Point Features
                  </div>
                  <div style={{ fontFamily: P, fontSize: 11, color: C.tm }}>
                    Enable or disable feature highlights for this plan.
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: M,
                    fontSize: 10,
                    color: C.brand,
                    background: "rgba(128,0,255,0.12)",
                    border: "1px solid rgba(128,0,255,0.25)",
                    padding: "3px 8px",
                    borderRadius: 100,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {featurePoints.filter((f) => f.enabled).length} Active
                </span>
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
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

              {/* Feature Points List — page scrolls naturally, no inner cap */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {featurePoints.map((feat) => (
                  <div
                    key={feat.id}
                    onClick={() => toggleFeaturePoint(feat.id)}
                    style={{
                      ...toggleRowStyle(feat.enabled),
                      cursor: "pointer",
                      opacity: feat.enabled ? 1 : 0.5,
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

            <ACard style={{ padding: CARD_PAD, border: `1px solid ${staticColor}33`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: staticColor }} />
              <div style={{ fontFamily: M, fontSize: 10, color: C.td, letterSpacing: "0.1em", marginBottom: 10 }}>
                CARD PREVIEW
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${staticColor}20`, border: `1px solid ${staticColor}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                  {staticEmoji}
                </div>
                <div>
                  <div style={{ fontFamily: P, fontSize: 15, fontWeight: 700, color: C.t1 }}>{name || "Untitled Plan"}</div>
                  <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: staticColor }}>${monthly || "0"} / month</div>
                </div>
              </div>
              <div style={{ fontFamily: P, fontSize: 11, color: C.tm }}>
                {featurePoints.filter((f) => f.enabled).length} active features · {selectedSignalTypes.length} signal types · {selectedCategories.length} categories
              </div>
            </ACard>
          </div>
        </form>
      )}
    </div>
  );
}
