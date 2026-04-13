import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── TYPES ────────────────────────────────────────────────────────────────────

type SkinId = "silver" | "gold" | "onyx" | "rose" | "cyan" | "purple" | "emerald" | "crimson";
type EyeId  = "blue" | "green" | "red" | "purple" | "orange" | "white";
type SuitId = "none" | "tuxedo" | "space" | "knight" | "ninja" | "lab";
type AccId  = "none" | "tophat" | "cap" | "halo" | "crown" | "glasses" | "shades";
type AntId  = "ball" | "star" | "heart" | "diamond" | "none";
type ExprId = "happy" | "excited" | "cool" | "shy";

interface Skin     { id: SkinId;  label: string; body: string; plate: string; accent: string; }
interface Eye      { id: EyeId;   label: string; color: string; glow: string; }
interface Suit     { id: SuitId;  label: string; emoji: string; cape: boolean; badge: boolean; collar: boolean; color: string | null; }
interface Acc      { id: AccId;   label: string; emoji: string; head: string | null; face: string | null; }
interface Antenna  { id: AntId;   label: string; color: string; shape: "circle" | "diamond" | "none"; }
interface Expr     { id: ExprId;  label: string; emoji: string; mouthW: number; mouthColor: string; eyeGlow: boolean; }

interface RobotConfig {
  skin: SkinId;
  eyes: EyeId;
  suit: SuitId;
  accessory: AccId;
  antenna: AntId;
  expression: ExprId;
}

interface Props {
  onSave?: (config: RobotConfig) => void;
  initialConfig?: Partial<RobotConfig>;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const SKINS: Skin[] = [
  { id: "silver",  label: "Silver",  body: "#C8CDD6", plate: "#E8ECF2", accent: "#A0A8B5" },
  { id: "gold",    label: "Gold",    body: "#C8A84B", plate: "#E8CF7A", accent: "#A08030" },
  { id: "onyx",    label: "Onyx",    body: "#2A2D35", plate: "#3D4150", accent: "#1A1D24" },
  { id: "rose",    label: "Rose",    body: "#C87B8A", plate: "#E8A0B0", accent: "#A05060" },
  { id: "cyan",    label: "Cyan",    body: "#4A9BAA", plate: "#6ABFCC", accent: "#307A88" },
  { id: "purple",  label: "Purple",  body: "#7B5AAA", plate: "#9B7ACA", accent: "#5A3A88" },
  { id: "emerald", label: "Emerald", body: "#3A9A6A", plate: "#5ABA8A", accent: "#207850" },
  { id: "crimson", label: "Crimson", body: "#AA3A4A", plate: "#CA5A6A", accent: "#881828" },
];

const EYES: Eye[] = [
  { id: "blue",   label: "Blue",   color: "#4A9EE8", glow: "#7ABEFF" },
  { id: "green",  label: "Green",  color: "#4AE87A", glow: "#7AFFAA" },
  { id: "red",    label: "Red",    color: "#E84A4A", glow: "#FF7A7A" },
  { id: "purple", label: "Purple", color: "#9A4AE8", glow: "#BB7AFF" },
  { id: "orange", label: "Orange", color: "#E8994A", glow: "#FFBB7A" },
  { id: "white",  label: "White",  color: "#E8F0FF", glow: "#FFFFFF" },
];

const SUITS: Suit[] = [
  { id: "none",   label: "None",     emoji: "🤖", cape: false, badge: false, collar: false, color: null       },
  { id: "tuxedo", label: "Tuxedo",   emoji: "🎩", cape: false, badge: false, collar: true,  color: "#1A1A2E"  },
  { id: "space",  label: "Space",    emoji: "🚀", cape: false, badge: true,  collar: false, color: "#1A3A5C"  },
  { id: "knight", label: "Knight",   emoji: "⚔️",  cape: true,  badge: true,  collar: false, color: "#3A3A4A"  },
  { id: "ninja",  label: "Ninja",    emoji: "🥷", cape: false, badge: false, collar: true,  color: "#111111"  },
  { id: "lab",    label: "Lab Coat", emoji: "🔬", cape: false, badge: true,  collar: true,  color: "#F0F0FF"  },
];

const ACCESSORIES: Acc[] = [
  { id: "none",    label: "None",     emoji: "—",  head: null,      face: null      },
  { id: "tophat",  label: "Top Hat",  emoji: "🎩", head: "tophat",  face: null      },
  { id: "cap",     label: "Cap",      emoji: "🧢", head: "cap",     face: null      },
  { id: "halo",    label: "Halo",     emoji: "😇", head: "halo",    face: null      },
  { id: "crown",   label: "Crown",    emoji: "👑", head: "crown",   face: null      },
  { id: "glasses", label: "Glasses",  emoji: "👓", head: null,      face: "glasses" },
  { id: "shades",  label: "Shades",   emoji: "🕶️", head: null,      face: "shades"  },
];

const ANTENNAS: Antenna[] = [
  { id: "ball",    label: "Ball",    color: "#4A9EE8", shape: "circle"  },
  { id: "star",    label: "Star",    color: "#FFD700", shape: "circle"  },
  { id: "heart",   label: "Heart",   color: "#FF6B8A", shape: "circle"  },
  { id: "diamond", label: "Diamond", color: "#A0E8FF", shape: "diamond" },
  { id: "none",    label: "None",    color: "transparent", shape: "none" },
];

const EXPRESSIONS: Expr[] = [
  { id: "happy",   label: "Happy",   emoji: "😊", mouthW: 30, mouthColor: "#555", eyeGlow: false },
  { id: "excited", label: "Excited", emoji: "🤩", mouthW: 40, mouthColor: "#4A9EE8", eyeGlow: true  },
  { id: "cool",    label: "Cool",    emoji: "😎", mouthW: 22, mouthColor: "#555", eyeGlow: false },
  { id: "shy",     label: "Shy",     emoji: "🥺", mouthW: 18, mouthColor: "#888", eyeGlow: false },
];

const TABS = ["Look", "Outfit", "Face", "Extras"] as const;

// ─── ROBOT RENDERER ───────────────────────────────────────────────────────────

interface RobotProps {
  config: RobotConfig;
}

function RobotRenderer({ config }: RobotProps) {
  const s   = SKINS.find((x) => x.id === config.skin)        ?? SKINS[0];
  const e   = EYES.find((x) => x.id === config.eyes)         ?? EYES[0];
  const su  = SUITS.find((x) => x.id === config.suit)        ?? SUITS[0];
  const ac  = ACCESSORIES.find((x) => x.id === config.accessory) ?? ACCESSORIES[0];
  const an  = ANTENNAS.find((x) => x.id === config.antenna)  ?? ANTENNAS[0];
  const ex  = EXPRESSIONS.find((x) => x.id === config.expression) ?? EXPRESSIONS[0];

  const floatAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const waveAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Float
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 1800, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0,   duration: 1800, useNativeDriver: true }),
      ])
    ).start();

    // Blink
    const doBlink = () => {
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.05, duration: 80,  useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1,    duration: 80,  useNativeDriver: true }),
      ]).start(() => setTimeout(doBlink, 2500 + Math.random() * 2000));
    };
    doBlink();

    // Wave
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, { toValue: 1,  duration: 400, useNativeDriver: true }),
        Animated.timing(waveAnim, { toValue: -1, duration: 400, useNativeDriver: true }),
        Animated.timing(waveAnim, { toValue: 0,  duration: 300, useNativeDriver: true }),
        Animated.delay(2200),
      ])
    ).start();
  }, []);

  const bodyColor  = su.color ?? s.body;
  const plateColor = su.color ? `${su.color}BB` : s.plate;
  const armRotate  = waveAnim.interpolate({ inputRange: [-1, 1], outputRange: ["-18deg", "18deg"] });
  const shadowScale = floatAnim.interpolate({ inputRange: [-10, 0], outputRange: [0.82, 1] });
  const shadowOpacity = floatAnim.interpolate({ inputRange: [-10, 0], outputRange: [0.25, 0.55] });

  return (
    <Animated.View style={[rStyles.root, { transform: [{ translateY: floatAnim }] }]}>

      {/* ── HEAD ACCESSORY ── */}
      {ac.head === "tophat" && (
        <View style={rStyles.accWrap}>
          <View style={[rStyles.tophatBrim, { backgroundColor: "#111" }]} />
          <View style={[rStyles.tophatBody, { backgroundColor: "#1A1A1A" }]} />
        </View>
      )}
      {ac.head === "cap" && (
        <View style={rStyles.accWrap}>
          <View style={[rStyles.capBody, { backgroundColor: "#1A4A8A" }]} />
          <View style={[rStyles.capBrim, { backgroundColor: "#1A4A8A" }]} />
        </View>
      )}
      {ac.head === "halo" && (
        <View style={[rStyles.halo, { borderColor: "#FFD700", shadowColor: "#FFD700" }]} />
      )}
      {ac.head === "crown" && (
        <View style={rStyles.crownWrap}>
          {[6, 24, 42].map((left, i) => (
            <View key={i} style={[rStyles.crownSpike, { backgroundColor: "#FFD700", left }]} />
          ))}
          <View style={[rStyles.crownBase, { backgroundColor: "#FFD700" }]} />
        </View>
      )}

      {/* ── ANTENNA ── */}
      {an.shape !== "none" && (
        <View style={rStyles.antennaWrap}>
          <View style={[rStyles.antStem, { backgroundColor: s.accent }]} />
          <View style={[
            rStyles.antTip,
            {
              backgroundColor: an.color,
              shadowColor: an.color,
              transform: an.shape === "diamond" ? [{ rotate: "45deg" }] : [],
            },
          ]} />
        </View>
      )}

      {/* ── HEAD ── */}
      <View style={[rStyles.head, { backgroundColor: s.body, borderColor: s.accent }]}>
        <View style={[rStyles.headShine, { backgroundColor: s.plate }]} />

        {/* Ear discs */}
        <View style={[rStyles.ear, rStyles.earL, { backgroundColor: s.accent, shadowColor: e.glow }]} />
        <View style={[rStyles.ear, rStyles.earR, { backgroundColor: s.accent, shadowColor: e.glow }]} />

        {/* Face plate */}
        <View style={[rStyles.facePlate, { backgroundColor: s.plate }]}>
          {/* Eyes */}
          <View style={rStyles.eyeRow}>
            {/* Left eye */}
            <View style={[rStyles.eyeOuter, { shadowColor: ex.eyeGlow ? e.glow : "transparent" }]}>
              <Animated.View style={[rStyles.eyeInner, { backgroundColor: e.color, shadowColor: e.glow, transform: [{ scaleY: blinkAnim }] }]} />
              <View style={rStyles.eyeGlint} />
            </View>

            {/* Face accessory */}
            {ac.face === "glasses" && (
              <View style={rStyles.glasses}>
                <View style={[rStyles.glassLens, { borderColor: "#777" }]} />
                <View style={[rStyles.glassBridge, { backgroundColor: "#777" }]} />
                <View style={[rStyles.glassLens, { borderColor: "#777" }]} />
              </View>
            )}
            {ac.face === "shades" && (
              <View style={rStyles.glasses}>
                <View style={[rStyles.glassLens, { borderColor: "#222", backgroundColor: "rgba(0,0,0,0.75)" }]} />
                <View style={[rStyles.glassBridge, { backgroundColor: "#222" }]} />
                <View style={[rStyles.glassLens, { borderColor: "#222", backgroundColor: "rgba(0,0,0,0.75)" }]} />
              </View>
            )}

            {/* Right eye */}
            <View style={[rStyles.eyeOuter, { shadowColor: ex.eyeGlow ? e.glow : "transparent" }]}>
              <Animated.View style={[rStyles.eyeInner, { backgroundColor: e.color, shadowColor: e.glow, transform: [{ scaleY: blinkAnim }] }]} />
              <View style={rStyles.eyeGlint} />
            </View>
          </View>

          {/* Mouth */}
          <View style={[rStyles.mouth, { width: ex.mouthW, borderBottomColor: ex.mouthColor, shadowColor: ex.mouthColor }]} />
        </View>
      </View>

      {/* ── NECK ── */}
      <View style={[rStyles.neck, { backgroundColor: s.accent }]} />

      {/* ── CAPE (behind torso) ── */}
      {su.cape && <View style={[rStyles.cape, { backgroundColor: "#8B0000" }]} />}

      {/* ── TORSO ── */}
      <View style={[rStyles.torso, { backgroundColor: bodyColor, borderColor: s.accent }]}>
        <View style={[rStyles.chestPlate, { backgroundColor: plateColor }]}>
          {su.badge && (
            <View style={[rStyles.badge, { backgroundColor: e.color, shadowColor: e.glow }]}>
              <View style={[rStyles.badgeInner, { backgroundColor: e.glow }]} />
            </View>
          )}
          {su.collar && (
            <>
              <View style={[rStyles.collarL, { backgroundColor: su.color === "#F0F0FF" ? "#FFF" : "#DDD" }]} />
              <View style={[rStyles.collarR, { backgroundColor: su.color === "#F0F0FF" ? "#FFF" : "#DDD" }]} />
            </>
          )}
        </View>
        <View style={[rStyles.bellyLight, { backgroundColor: e.color, shadowColor: e.glow }]} />
        <View style={[rStyles.beltLine, { backgroundColor: s.accent }]} />
      </View>

      {/* ── ARMS ── */}
      <Animated.View style={[rStyles.armL, { backgroundColor: bodyColor, borderColor: s.accent, transform: [{ rotate: armRotate }] }]}>
        <View style={[rStyles.hand, { backgroundColor: s.body }]} />
      </Animated.View>
      <View style={[rStyles.armR, { backgroundColor: bodyColor, borderColor: s.accent }]}>
        <View style={[rStyles.hand, { backgroundColor: s.body }]} />
      </View>

      {/* ── LEGS ── */}
      <View style={rStyles.legsRow}>
        {[0, 1].map((i) => (
          <View key={i} style={[rStyles.leg, { backgroundColor: bodyColor, borderColor: s.accent }]}>
            <View style={[rStyles.foot, { backgroundColor: s.accent }]} />
          </View>
        ))}
      </View>

      {/* ── SHADOW ── */}
      <Animated.View style={[rStyles.shadow, { opacity: shadowOpacity, transform: [{ scaleX: shadowScale }] }]} />
    </Animated.View>
  );
}

// ─── OPTION PILL ──────────────────────────────────────────────────────────────

interface PillProps {
  label: string;
  emoji?: string;
  swatchColor?: string;
  selected: boolean;
  onPress: () => void;
}

function OptionPill({ label, emoji, swatchColor, selected, onPress }: PillProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.88, useNativeDriver: true, speed: 60 }),
      Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 20 }),
    ]).start();
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
      <Animated.View style={[pStyles.pill, selected && pStyles.pillSelected, { transform: [{ scale }] }]}>
        {swatchColor && (
          <View style={[pStyles.swatch, { backgroundColor: swatchColor }, selected && pStyles.swatchSelected]} />
        )}
        {emoji && !swatchColor && (
          <Text style={pStyles.emoji}>{emoji}</Text>
        )}
        <Text style={[pStyles.label, selected && pStyles.labelSelected]}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── SECTION ──────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sStyles.section}>
      <Text style={sStyles.title}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={sStyles.row}>
        {children}
      </ScrollView>
    </View>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function MainDash({ onSave, initialConfig }: Props) {
  const [config, setConfig] = useState<RobotConfig>({
    skin:       initialConfig?.skin        ?? "silver",
    eyes:       initialConfig?.eyes        ?? "blue",
    suit:       initialConfig?.suit        ?? "none",
    accessory:  initialConfig?.accessory   ?? "none",
    antenna:    initialConfig?.antenna     ?? "ball",
    expression: initialConfig?.expression  ?? "happy",
  });

  const [tab, setTab] = useState(0);

  const set = <K extends keyof RobotConfig>(key: K, value: RobotConfig[K]) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => onSave?.(config);

  return (
    <View style={styles.container}>
      {/* ── HEADER ── */}
      <Text style={styles.title}>Your Bimo 🤖</Text>
      <Text style={styles.subtitle}>Customize it to make it yours</Text>

      {/* ── PREVIEW ── */}
      <View style={styles.previewBox}>
        <RobotRenderer config={config} />
      </View>

      {/* ── TAB BAR ── */}
      <View style={styles.tabBar}>
        {TABS.map((t, i) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === i && styles.tabBtnActive]}
            onPress={() => setTab(i)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabLabel, tab === i && styles.tabLabelActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── OPTIONS ── */}
      <ScrollView style={styles.panel} showsVerticalScrollIndicator={false}>
        {tab === 0 && (
          <>
            <Section title="Skin Color">
              {SKINS.map((sk) => (
                <OptionPill key={sk.id} label={sk.label} swatchColor={sk.body} selected={config.skin === sk.id} onPress={() => set("skin", sk.id)} />
              ))}
            </Section>
            <Section title="Eye Color">
              {EYES.map((ey) => (
                <OptionPill key={ey.id} label={ey.label} swatchColor={ey.color} selected={config.eyes === ey.id} onPress={() => set("eyes", ey.id)} />
              ))}
            </Section>
            <Section title="Antenna">
              {ANTENNAS.map((an) => (
                <OptionPill key={an.id} label={an.label} emoji={an.shape === "none" ? "—" : "📡"} selected={config.antenna === an.id} onPress={() => set("antenna", an.id)} />
              ))}
            </Section>
          </>
        )}
        {tab === 1 && (
          <Section title="Suit / Style">
            {SUITS.map((su) => (
              <OptionPill key={su.id} label={su.label} emoji={su.emoji} selected={config.suit === su.id} onPress={() => set("suit", su.id)} />
            ))}
          </Section>
        )}
        {tab === 2 && (
          <Section title="Expression">
            {EXPRESSIONS.map((ex) => (
              <OptionPill key={ex.id} label={ex.label} emoji={ex.emoji} selected={config.expression === ex.id} onPress={() => set("expression", ex.id)} />
            ))}
          </Section>
        )}
        {tab === 3 && (
          <Section title="Accessories">
            {ACCESSORIES.map((ac) => (
              <OptionPill key={ac.id} label={ac.label} emoji={ac.emoji} selected={config.accessory === ac.id} onPress={() => set("accessory", ac.id)} />
            ))}
          </Section>
        )}

        {/* ── SAVE ── */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Save My Bimo</Text>
        </TouchableOpacity>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: "#E8E8E2" },
  title:          { fontSize: 26, fontWeight: "800", color: "#111", textAlign: "center", marginTop: 52, marginBottom: 2 },
  subtitle:       { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 12 },

  previewBox: {
    height: 280, alignItems: "center", justifyContent: "center",
    marginHorizontal: 20, backgroundColor: "#fff",
    borderRadius: 20, borderWidth: 2, borderColor: "#000",
    marginBottom: 16, overflow: "visible",
  },

  tabBar:       { flexDirection: "row", marginHorizontal: 20, marginBottom: 4, gap: 8 },
  tabBtn:       { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 2, borderColor: "#000", backgroundColor: "#fff", alignItems: "center" },
  tabBtnActive: { backgroundColor: "#C7FF01" },
  tabLabel:     { fontSize: 13, fontWeight: "700", color: "#555" },
  tabLabelActive: { color: "#111" },

  panel: { flex: 1 },

  saveBtn: {
    marginHorizontal: 20, marginTop: 24, paddingVertical: 16,
    backgroundColor: "#C7FF01", borderRadius: 14, alignItems: "center",
    borderWidth: 2, borderColor: "#000",
  },
  saveBtnText: { fontSize: 17, fontWeight: "800", color: "#111" },
});

const pStyles = StyleSheet.create({
  pill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 9,
    backgroundColor: "#fff", borderRadius: 20,
    borderWidth: 2, borderColor: "#000",
  },
  pillSelected: { backgroundColor: "#C7FF01" },
  swatch:         { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: "transparent" },
  swatchSelected: { borderColor: "#000" },
  emoji:          { fontSize: 14 },
  label:          { fontSize: 12, fontWeight: "700", color: "#333" },
  labelSelected:  { color: "#111" },
});

const sStyles = StyleSheet.create({
  section: { paddingTop: 16, paddingHorizontal: 20 },
  title:   { fontSize: 11, fontWeight: "800", color: "#999", letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 10 },
  row:     { flexDirection: "row", gap: 8, paddingBottom: 4 },
});

// ─── ROBOT STYLES ─────────────────────────────────────────────────────────────

const rStyles = StyleSheet.create({
  root:         { alignItems: "center", position: "relative" },

  // Head accessories
  accWrap:      { alignItems: "center", marginBottom: -6, zIndex: 4 },
  tophatBrim:   { width: 80, height: 7, borderRadius: 3 },
  tophatBody:   { width: 52, height: 32, borderRadius: 5, marginTop: -1 },
  capBody:      { width: 70, height: 26, borderRadius: 13, marginBottom: -3 },
  capBrim:      { width: 80, height: 8, borderRadius: 3 },
  halo:         { width: 68, height: 20, borderRadius: 34, borderWidth: 5, marginBottom: -10, shadowRadius: 8, shadowOpacity: 0.9 },
  crownWrap:    { position: "relative", width: 62, height: 28, marginBottom: -6, zIndex: 4 },
  crownSpike:   { position: "absolute", bottom: 8, width: 10, height: 20, borderRadius: 5 },
  crownBase:    { position: "absolute", bottom: 0, width: 62, height: 13, borderRadius: 4 },

  // Antenna
  antennaWrap:  { alignItems: "center", marginBottom: -2, zIndex: 3 },
  antStem:      { width: 4, height: 22, borderRadius: 2 },
  antTip:       { width: 14, height: 14, borderRadius: 7, marginTop: -3, shadowRadius: 8, shadowOpacity: 0.9 },

  // Head
  head:         { width: 92, height: 76, borderRadius: 16, borderWidth: 2, alignItems: "center", justifyContent: "center", position: "relative", shadowColor: "#000", shadowRadius: 8, shadowOpacity: 0.15, shadowOffset: { width: 0, height: 3 }, elevation: 5, zIndex: 2 },
  headShine:    { position: "absolute", top: 7, left: 10, width: 22, height: 10, borderRadius: 8, opacity: 0.5 },
  ear:          { position: "absolute", width: 14, height: 24, borderRadius: 7, top: 20, shadowRadius: 4, shadowOpacity: 0.5 },
  earL:         { left: -12 },
  earR:         { right: -12 },

  // Face
  facePlate:    { width: 72, height: 54, borderRadius: 10, alignItems: "center", justifyContent: "center", paddingTop: 4, gap: 5 },
  eyeRow:       { flexDirection: "row", alignItems: "center", gap: 14 },
  eyeOuter:     { width: 27, height: 27, borderRadius: 14, backgroundColor: "#111", alignItems: "center", justifyContent: "center", shadowRadius: 6, shadowOpacity: 0.8 },
  eyeInner:     { width: 19, height: 19, borderRadius: 10, shadowRadius: 5, shadowOpacity: 1 },
  eyeGlint:     { position: "absolute", top: 4, right: 4, width: 5, height: 5, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.9)" },
  mouth:        { height: 0, borderBottomWidth: 3, borderRadius: 8, shadowRadius: 4, shadowOpacity: 0.6 },

  // Face accessories
  glasses:      { position: "absolute", flexDirection: "row", alignItems: "center" },
  glassLens:    { width: 23, height: 17, borderRadius: 6, borderWidth: 2, backgroundColor: "transparent" },
  glassBridge:  { width: 8, height: 2 },

  // Neck
  neck:         { width: 20, height: 10, borderRadius: 3, marginTop: -1, zIndex: 1 },

  // Cape
  cape:         { position: "absolute", top: 90, width: 68, height: 82, borderRadius: 6, zIndex: 0, opacity: 0.9 },

  // Torso
  torso:        { width: 80, height: 70, borderRadius: 14, borderWidth: 2, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowRadius: 6, shadowOpacity: 0.12, shadowOffset: { width: 0, height: 2 }, elevation: 4, zIndex: 1 },
  chestPlate:   { width: 58, height: 38, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  badge:        { width: 14, height: 14, borderRadius: 7, alignItems: "center", justifyContent: "center", shadowRadius: 6, shadowOpacity: 0.9 },
  badgeInner:   { width: 6, height: 6, borderRadius: 3 },
  collarL:      { position: "absolute", left: 4,  top: -5, width: 14, height: 22, borderRadius: 4, transform: [{ rotate: "-18deg" }] },
  collarR:      { position: "absolute", right: 4, top: -5, width: 14, height: 22, borderRadius: 4, transform: [{ rotate: "18deg"  }] },
  bellyLight:   { width: 10, height: 10, borderRadius: 5, marginTop: 4, shadowRadius: 8, shadowOpacity: 1 },
  beltLine:     { position: "absolute", bottom: 10, width: "88%", height: 3, borderRadius: 2 },

  // Arms
  armL:         { position: "absolute", left: -40, top: 108, width: 23, height: 48, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "flex-end", paddingBottom: 3, transformOrigin: "top center", elevation: 3 },
  armR:         { position: "absolute", right: -40, top: 108, width: 23, height: 48, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "flex-end", paddingBottom: 3, elevation: 3 },
  hand:         { width: 17, height: 15, borderRadius: 8 },

  // Legs
  legsRow:      { flexDirection: "row", gap: 12, marginTop: 4 },
  leg:          { width: 26, height: 42, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "flex-end", elevation: 3 },
  foot:         { width: 30, height: 12, borderRadius: 6, marginBottom: -1 },

  // Shadow
  shadow:       { width: 80, height: 14, borderRadius: 40, backgroundColor: "rgba(0,0,0,0.18)", marginTop: 8 },
});