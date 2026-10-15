import { useColorScheme } from "nativewind";
import Svg, { Circle, Ellipse, G, Path, Rect } from "react-native-svg";

// "B cream" palette from the approved design, with the brand-orange scarf.
const PALETTE = {
  skin: "#F3E3C3",
  skinDark: "#E6D2AC",
  spots: "#C9894B",
  belly: "#FFF7E8",
  hooves: "#5C4030",
  horns: "#8B5E3C",
  eyes: "#2B1D14",
  blush: "#F0A88A",
  scarf: "#b37458",
  scarfDark: "#9a5f45",
};

export type GiraffeMood = "happy" | "sad";

interface GiraffeMascotProps {
  size?: number;
  mood?: GiraffeMood;
}

const MOUTH: Record<GiraffeMood, string> = {
  happy: "M306 198 Q318 207 330 198",
  sad: "M306 204 Q318 195 330 204",
};

// App mascot: a standing giraffe in a scarf, drawn without a background.
export function GiraffeMascot({ size = 180, mood = "happy" }: GiraffeMascotProps) {
  const { colorScheme } = useColorScheme();
  const p = PALETTE;
  const shadow = colorScheme === "dark" ? "rgba(0,0,0,0.45)" : "rgba(90,60,30,0.12)";

  return (
    <Svg width={size} height={size} viewBox="0 0 512 512" accessibilityLabel="Giraffe mascot">
      <Ellipse cx={236} cy={458} rx={150} ry={14} fill={shadow} />

      {/* Tail */}
      <Path
        d="M140 318 C112 326 104 352 110 382"
        stroke={p.skinDark}
        strokeWidth={9}
        strokeLinecap="round"
        fill="none"
      />
      <Ellipse cx={110} cy={392} rx={12} ry={16} fill={p.spots} />

      {/* Far legs */}
      <Rect x={168} y={352} width={34} height={96} rx={17} fill={p.skinDark} />
      <Rect x={276} y={352} width={34} height={96} rx={17} fill={p.skinDark} />
      <Rect x={166} y={430} width={38} height={24} rx={12} fill={p.hooves} />
      <Rect x={274} y={430} width={38} height={24} rx={12} fill={p.hooves} />

      {/* Body */}
      <Rect x={136} y={270} width={214} height={120} rx={60} fill={p.skin} />
      <Ellipse cx={240} cy={372} rx={78} ry={20} fill={p.belly} />

      {/* Near legs */}
      <Rect x={204} y={356} width={34} height={96} rx={17} fill={p.skin} />
      <Rect x={310} y={356} width={34} height={96} rx={17} fill={p.skin} />
      <Rect x={202} y={434} width={38} height={24} rx={12} fill={p.hooves} />
      <Rect x={308} y={434} width={38} height={24} rx={12} fill={p.hooves} />

      {/* Body spots */}
      <Rect x={164} y={296} width={40} height={30} rx={14} fill={p.spots} transform="rotate(-12 184 311)" />
      <Rect x={226} y={310} width={30} height={24} rx={11} fill={p.spots} transform="rotate(10 241 322)" />
      <Rect x={176} y={338} width={20} height={16} rx={8} fill={p.spots} transform="rotate(8 186 346)" />

      {/* Neck */}
      <Rect x={276} y={128} width={62} height={190} rx={31} fill={p.skin} transform="rotate(12 307 300)" />
      <Rect x={292} y={196} width={26} height={22} rx={10} fill={p.spots} transform="rotate(14 305 207)" />
      <Rect x={282} y={244} width={22} height={18} rx={8} fill={p.spots} transform="rotate(-6 293 253)" />
      <Circle cx={270} cy={182} r={9} fill={p.spots} />
      <Circle cx={266} cy={204} r={9} fill={p.spots} />
      <Circle cx={263} cy={226} r={9} fill={p.spots} />

      {/* Scarf */}
      <Rect x={270} y={262} width={88} height={28} rx={14} fill={p.scarf} transform="rotate(12 314 276)" />
      <Rect x={314} y={276} width={22} height={50} rx={10} fill={p.scarf} transform="rotate(18 325 276)" />
      <Rect x={336} y={272} width={20} height={40} rx={9} fill={p.scarfDark} transform="rotate(34 346 272)" />

      {/* Head */}
      <G transform="rotate(-10 316 150)">
        <Rect x={282} y={58} width={16} height={46} rx={8} fill={p.skinDark} />
        <Rect x={338} y={58} width={16} height={46} rx={8} fill={p.skinDark} />
        <Circle cx={290} cy={56} r={14} fill={p.horns} />
        <Circle cx={346} cy={56} r={14} fill={p.horns} />

        <Ellipse cx={236} cy={118} rx={30} ry={14} fill={p.skinDark} transform="rotate(-18 236 118)" />
        <Ellipse cx={400} cy={118} rx={30} ry={14} fill={p.skinDark} transform="rotate(18 400 118)" />
        <Ellipse cx={240} cy={118} rx={16} ry={6} fill={p.belly} transform="rotate(-18 240 118)" />
        <Ellipse cx={396} cy={118} rx={16} ry={6} fill={p.belly} transform="rotate(18 396 118)" />

        <Rect x={236} y={84} width={160} height={134} rx={66} fill={p.skin} />
        <Ellipse cx={318} cy={188} rx={58} ry={32} fill={p.belly} />

        <Ellipse cx={288} cy={150} rx={13} ry={17} fill={p.eyes} />
        <Ellipse cx={346} cy={150} rx={13} ry={17} fill={p.eyes} />
        <Circle cx={292} cy={143} r={5.5} fill="#ffffff" />
        <Circle cx={350} cy={143} r={5.5} fill="#ffffff" />
        <Circle cx={284} cy={158} r={2.2} fill="#ffffff" />
        <Circle cx={342} cy={158} r={2.2} fill="#ffffff" />

        <Ellipse cx={262} cy={174} rx={14} ry={8} fill={p.blush} opacity={0.75} />
        <Ellipse cx={372} cy={174} rx={14} ry={8} fill={p.blush} opacity={0.75} />

        <Ellipse cx={304} cy={180} rx={4.5} ry={5.5} fill={p.hooves} />
        <Ellipse cx={332} cy={180} rx={4.5} ry={5.5} fill={p.hooves} />
        {mood === "sad" && (
          <G stroke={p.eyes} strokeWidth={4} strokeLinecap="round">
            <Path d="M274 130 L298 123" />
            <Path d="M360 130 L336 123" />
          </G>
        )}
        <Path
          d={MOUTH[mood]}
          stroke={p.hooves}
          strokeWidth={4.5}
          strokeLinecap="round"
          fill="none"
        />
      </G>
    </Svg>
  );
}
