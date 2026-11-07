import { RoundedBox } from "@react-three/drei";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { seeded } from "../trade-mate/Props";

export type Vec3 = [number, number, number];
export type Mood = "angry" | "neutral" | "happy" | "sheepish";

export type ArmPose = { shoulder: Vec3; elbow: number };

export type PersonPose = {
  hipL: number; // + = thigh forward/up
  hipR: number;
  kneeL: number; // + = shin bends back
  kneeR: number;
  spine: number; // + = lean forward
  torsoTurn: number;
  armL: ArmPose; // shoulder x: - = forward/up; elbow: - = bend forward
  armR: ArmPose;
  headTilt: number;
  headTurn: number;
  mood: Mood;
  mouthOpen: number;
  blink: number;
  bodyY: number;
};

export type Look = {
  kind: "lee" | "gf";
  skin: string;
};

const HIP_Y = 0.92;
const THIGH = 0.44;
const SHIN = 0.42;

const mat = (color: string, roughness = 0.7, extra = {}) => (
  <meshStandardMaterial color={color} roughness={roughness} {...extra} />
);

// ---------- Hair ----------

const LeeHair: React.FC = () => {
  // Spiky, swept-up grey hair: a short cap plus lots of little tufts.
  const spikes = useMemo(() => {
    const rand = seeded(7);
    return Array.from({ length: 60 }).map(() => {
      const theta = rand() * Math.PI * 2;
      const phi = rand() * 1.05; // from the crown down
      const len = 0.035 + rand() * 0.045 + (phi < 0.6 ? 0.02 : 0);
      const shades = ["#a8a39b", "#928d86", "#bab5ad", "#7f7a74"];
      return {
        pos: [
          0.175 * Math.sin(phi) * Math.sin(theta),
          0.175 * Math.cos(phi) + 0.02,
          0.175 * Math.sin(phi) * Math.cos(theta),
        ] as Vec3,
        // Point outward from the head, swept up and back.
        rot: [phi * Math.cos(theta) - 0.35, 0, -phi * Math.sin(theta)] as Vec3,
        len,
        color: shades[Math.floor(rand() * shades.length)],
      };
    });
  }, []);
  return (
    <group>
      <mesh position={[0, 0.02, -0.01]} scale={[1.02, 0.95, 1.04]}>
        <sphereGeometry
          args={[0.18, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.42]}
        />
        {mat("#a9a59e", 0.9)}
      </mesh>
      {/* Short sides and back */}
      <mesh position={[0, -0.02, -0.03]} scale={[1.03, 1, 1.02]}>
        <sphereGeometry
          args={[
            0.18,
            32,
            16,
            Math.PI * 0.62,
            Math.PI * 1.76,
            Math.PI * 0.3,
            Math.PI * 0.32,
          ]}
        />
        {mat("#9b968e", 0.95)}
      </mesh>
      {spikes.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot}>
          <coneGeometry args={[0.016, s.len, 5]} />
          {mat(s.color, 0.85)}
        </mesh>
      ))}
    </group>
  );
};

const GfHair: React.FC = () => {
  // Long, wavy caramel hair with lighter highlights.
  const strands = useMemo(() => {
    const rand = seeded(19);
    return Array.from({ length: 26 }).map((_, i) => {
      const side = i % 2 ? 1 : -1;
      const back = i < 16;
      const x = back ? (rand() - 0.5) * 0.34 : side * (0.17 + rand() * 0.03);
      const z = back ? -0.1 - rand() * 0.05 : -0.05 - rand() * 0.03;
      const len = back ? 0.45 + rand() * 0.2 : 0.38 + rand() * 0.12;
      return {
        back,
        x,
        z,
        len,
        color: rand() > 0.5 ? "#a8652e" : rand() > 0.5 ? "#c98a4a" : "#8a4f22",
        wave: rand() * Math.PI * 2,
      };
    });
  }, []);
  return (
    <group>
      <mesh position={[0, 0.03, -0.01]} scale={[1.08, 1.02, 1.08]}>
        <sphereGeometry
          args={[0.18, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]}
        />
        {mat("#9a5a28", 0.6)}
      </mesh>
      {/* Side-swept fringe */}
      <mesh
        position={[0.05, 0.11, 0.1]}
        rotation={[0.5, 0, -0.5]}
        scale={[1.4, 0.5, 0.8]}
      >
        <sphereGeometry args={[0.09, 16, 12]} />
        {mat("#b3703a", 0.6)}
      </mesh>
      {/* Volume at the back */}
      <mesh position={[0, -0.12, -0.1]} scale={[1.25, 1.5, 0.75]}>
        <sphereGeometry args={[0.17, 24, 16]} />
        {mat("#9a5a28", 0.65)}
      </mesh>
      {strands.map((s, i) => {
        const back = s.back;
        return (
          <group key={i} position={[s.x, back ? 0.02 : -0.04, s.z]}>
            {[0, 1, 2].map((seg) => (
              <mesh
                key={seg}
                position={[
                  Math.sin(s.wave + seg * 1.6) * 0.02,
                  -0.08 - seg * s.len * 0.33,
                  0,
                ]}
                rotation={[0, 0, Math.sin(s.wave + seg) * 0.15]}
              >
                <capsuleGeometry
                  args={[
                    (back ? 0.034 : 0.024) - seg * 0.004,
                    s.len * 0.3,
                    4,
                    8,
                  ]}
                />
                {mat(s.color, 0.55)}
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
};

// ---------- Face ----------

const Face: React.FC<{ look: Look; pose: PersonPose }> = ({ look, pose }) => {
  const { mood, mouthOpen, blink } = pose;
  const gf = look.kind === "gf";
  const browAngle =
    mood === "angry"
      ? 0.45
      : mood === "sheepish"
        ? -0.35
        : mood === "happy"
          ? -0.15
          : 0;
  const browY = mood === "angry" ? 0.075 : mood === "sheepish" ? 0.105 : 0.09;
  const iris = gf ? "#5f7f92" : "#5b6b5a";
  return (
    <>
      {[-1, 1].map((side) => (
        <group key={side}>
          <group
            position={[side * 0.064, 0.025, 0.148]}
            scale={[1, Math.max(0.08, 1 - blink), 1]}
          >
            <mesh scale={[1.15, 1, 0.55]}>
              <sphereGeometry args={[0.036, 20, 20]} />
              {mat("#ffffff", 0.2)}
            </mesh>
            <mesh position={[0, 0, 0.018]}>
              <sphereGeometry args={[0.019, 16, 16]} />
              {mat(iris, 0.15)}
            </mesh>
            <mesh position={[0, 0, 0.027]}>
              <sphereGeometry args={[0.01, 12, 12]} />
              {mat("#111111", 0.1)}
            </mesh>
            <mesh position={[0.007, 0.008, 0.035]}>
              <sphereGeometry args={[0.005, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {gf ? (
              <mesh position={[0, 0.03, 0.02]} rotation={[0.4, 0, 0]}>
                <boxGeometry args={[0.08, 0.006, 0.016]} />
                {mat("#1a1210", 0.5)}
              </mesh>
            ) : null}
          </group>
          {/* Brows: hers are dark and arched, his are grey */}
          <mesh
            position={[side * 0.066, browY, 0.16]}
            rotation={[0, 0, side * browAngle + (gf ? side * -0.12 : 0)]}
          >
            <capsuleGeometry args={[gf ? 0.011 : 0.013, 0.06, 4, 8]} />
            {mat(gf ? "#3b2416" : "#7d776f", 0.8)}
          </mesh>
          <mesh position={[side * 0.17, -0.01, -0.005]} scale={[0.45, 1, 0.8]}>
            <sphereGeometry args={[0.048, 12, 12]} />
            {mat(look.skin, 0.6)}
          </mesh>
          <mesh position={[side * 0.1, -0.05, 0.12]} scale={[1, 0.7, 0.5]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            {mat(mood === "angry" ? "#e47a68" : "#efa48f", 0.6)}
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.015, 0.175]} scale={[0.85, 1.15, 1]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        {mat(look.skin, 0.5)}
      </mesh>
      {/* Mouth */}
      {mouthOpen > 0.05 ? (
        <mesh position={[0, -0.09, 0.15]} scale={[1, 0.3 + mouthOpen, 0.4]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          {mat("#5a1f1f", 0.6)}
        </mesh>
      ) : mood === "neutral" || mood === "angry" ? (
        <mesh position={[0, -0.09, 0.158]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.009, 0.05, 4, 8]} />
          {mat(gf ? "#c46a6a" : "#7a3a30", 0.5)}
        </mesh>
      ) : (
        <mesh
          position={[0.008, -0.07, 0.158]}
          rotation={[0, 0, Math.PI + (mood === "sheepish" ? 0.25 : 0)]}
        >
          <torusGeometry
            args={[0.04, 0.01, 8, 16, mood === "sheepish" ? 2.2 : Math.PI]}
          />
          {mat(gf ? "#c46a6a" : "#7a3a30", 0.5)}
        </mesh>
      )}
      {gf && mouthOpen <= 0.05 ? (
        <mesh position={[0, -0.078, 0.155]} scale={[1.6, 0.6, 0.6]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          {mat("#d07c7c", 0.4)}
        </mesh>
      ) : null}
      {look.kind === "lee" ? (
        <>
          {/* Grey goatee and moustache */}
          <mesh position={[0, -0.135, 0.12]} scale={[1.2, 1, 0.8]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            {mat("#cfcac2", 0.95)}
          </mesh>
          <mesh position={[0, -0.06, 0.163]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.012, 0.07, 4, 8]} />
            {mat("#c2bdb5", 0.95)}
          </mesh>
          {/* Clear grey round glasses */}
          {[-1, 1].map((side) => (
            <group key={side} position={[side * 0.064, 0.025, 0.18]}>
              <mesh>
                <torusGeometry args={[0.044, 0.007, 8, 24]} />
                <meshStandardMaterial
                  color="#a7adb3"
                  transparent
                  opacity={0.9}
                  roughness={0.2}
                />
              </mesh>
              <mesh>
                <circleGeometry args={[0.042, 24]} />
                <meshStandardMaterial
                  color="#dfe8ee"
                  transparent
                  opacity={0.12}
                  roughness={0}
                  metalness={0.3}
                />
              </mesh>
              <mesh
                position={[side * 0.06, 0, -0.09]}
                rotation={[0, side * 0.15, 0]}
              >
                <boxGeometry args={[0.006, 0.008, 0.18]} />
                <meshStandardMaterial
                  color="#a7adb3"
                  transparent
                  opacity={0.9}
                />
              </mesh>
            </group>
          ))}
          <mesh position={[0, 0.03, 0.182]}>
            <boxGeometry args={[0.04, 0.007, 0.006]} />
            <meshStandardMaterial color="#a7adb3" transparent opacity={0.9} />
          </mesh>
        </>
      ) : null}
    </>
  );
};

// ---------- Limbs ----------

const Arm: React.FC<{
  side: 1 | -1;
  x: number;
  y: number;
  pose: ArmPose;
  sleeve: string;
  skin: string;
  cuff?: string;
  item?: ReactNode;
}> = ({ side, x, y, pose, sleeve, skin, cuff, item }) => (
  <group position={[side * x, y, 0]} rotation={pose.shoulder}>
    <mesh>
      <sphereGeometry args={[0.072, 16, 16]} />
      {mat(sleeve, 0.8)}
    </mesh>
    <mesh position={[0, -0.15, 0]}>
      <capsuleGeometry args={[0.06, 0.2, 6, 12]} />
      {mat(sleeve, 0.8)}
    </mesh>
    <group position={[0, -0.3, 0]} rotation={[pose.elbow, 0, 0]}>
      <mesh position={[0, -0.12, 0]}>
        <capsuleGeometry args={[0.052, 0.18, 6, 12]} />
        {mat(sleeve, 0.8)}
      </mesh>
      {cuff ? (
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.054, 0.054, 0.03, 12]} />
          {mat(cuff, 0.8)}
        </mesh>
      ) : null}
      <group position={[0, -0.28, 0]}>
        <mesh scale={[0.85, 1.1, 0.6]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          {mat(skin, 0.55)}
        </mesh>
        {item}
      </group>
    </group>
  </group>
);

const Leg: React.FC<{
  side: 1 | -1;
  hip: number;
  knee: number;
  trousers: string;
  shoe: ReactNode;
  pocket?: string;
}> = ({ side, hip, knee, trousers, shoe, pocket }) => (
  <group position={[side * 0.11, HIP_Y, 0]} rotation={[-hip, 0, 0]}>
    <mesh position={[0, -THIGH / 2, 0]}>
      <capsuleGeometry args={[0.085, THIGH - 0.06, 6, 12]} />
      {mat(trousers, 0.85)}
    </mesh>
    {pocket ? (
      <RoundedBox
        args={[0.05, 0.15, 0.13]}
        radius={0.015}
        position={[side * 0.085, -0.25, 0]}
      >
        {mat(pocket, 0.85)}
      </RoundedBox>
    ) : null}
    <group position={[0, -THIGH, 0]} rotation={[knee, 0, 0]}>
      <mesh position={[0, -SHIN / 2, 0]}>
        <capsuleGeometry args={[0.07, SHIN - 0.05, 6, 12]} />
        {mat(trousers, 0.85)}
      </mesh>
      <group position={[0, -SHIN, 0]}>{shoe}</group>
    </group>
  </group>
);

const LeeBoot = (
  <>
    <RoundedBox
      args={[0.13, 0.12, 0.27]}
      radius={0.04}
      position={[0, -0.02, 0.05]}
    >
      {mat("#141414", 0.4)}
    </RoundedBox>
    <mesh position={[0, -0.075, 0.05]}>
      <boxGeometry args={[0.14, 0.025, 0.28]} />
      {mat("#0a0a0a", 0.9)}
    </mesh>
  </>
);

const GfBoot = (
  <>
    <RoundedBox args={[0.11, 0.16, 0.22]} radius={0.04} position={[0, 0, 0.04]}>
      {mat("#b98a5c", 0.75)}
    </RoundedBox>
    <mesh position={[0, -0.08, -0.04]}>
      <boxGeometry args={[0.08, 0.05, 0.06]} />
      {mat("#5a3a22", 0.7)}
    </mesh>
  </>
);

// ---------- Body ----------

export const Person: React.FC<{
  look: Look;
  position: Vec3;
  rotationY: number;
  pose: PersonPose;
  rightHand?: ReactNode;
  leftHand?: ReactNode;
}> = ({ look, position, rotationY, pose, rightHand, leftHand }) => {
  const gf = look.kind === "gf";
  const top = gf ? "#b98a55" : "#1c1d22"; // blazer / black shirt
  const trousers = gf ? "#27324d" : "#1f2126";
  const shoulderX = gf ? 0.2 : 0.24;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group position={[0, pose.bodyY, 0]}>
        <Leg
          side={-1}
          hip={pose.hipR}
          knee={pose.kneeR}
          trousers={trousers}
          shoe={gf ? GfBoot : LeeBoot}
          pocket={gf ? undefined : "#25272d"}
        />
        <Leg
          side={1}
          hip={pose.hipL}
          knee={pose.kneeL}
          trousers={trousers}
          shoe={gf ? GfBoot : LeeBoot}
          pocket={gf ? undefined : "#25272d"}
        />
        {/* Hips */}
        <RoundedBox
          args={[gf ? 0.4 : 0.4, 0.2, gf ? 0.25 : 0.24]}
          radius={0.08}
          position={[0, HIP_Y + 0.02, 0]}
        >
          {mat(trousers, 0.85)}
        </RoundedBox>
        {!gf ? (
          <mesh position={[0, HIP_Y + 0.11, 0]}>
            <boxGeometry args={[0.41, 0.04, 0.25]} />
            {mat("#0d0d0d", 0.5)}
          </mesh>
        ) : null}
        {/* Upper body pivots at the waist */}
        <group
          position={[0, HIP_Y + 0.08, 0]}
          rotation={[pose.spine, pose.torsoTurn, 0]}
        >
          {gf ? (
            <>
              {/* Black tee under an open tan blazer */}
              <RoundedBox
                args={[0.34, 0.5, 0.22]}
                radius={0.08}
                position={[0, 0.26, 0]}
              >
                {mat("#18181b", 0.85)}
              </RoundedBox>
              {[-1, 1].map((s) => (
                <group key={s}>
                  <RoundedBox
                    args={[0.15, 0.56, 0.25]}
                    radius={0.05}
                    position={[s * 0.115, 0.25, 0]}
                  >
                    {mat(top, 0.8)}
                  </RoundedBox>
                  <mesh
                    position={[s * 0.07, 0.41, 0.126]}
                    rotation={[0, 0, s * 0.45]}
                  >
                    <boxGeometry args={[0.05, 0.2, 0.012]} />
                    {mat("#a77a48", 0.8)}
                  </mesh>
                  <mesh position={[s * 0.12, 0.08, 0.128]}>
                    <boxGeometry args={[0.1, 0.06, 0.01]} />
                    {mat("#a77a48", 0.8)}
                  </mesh>
                </group>
              ))}
            </>
          ) : (
            <>
              <RoundedBox
                args={[0.46, 0.58, 0.26]}
                radius={0.1}
                position={[0, 0.28, 0]}
              >
                {mat(top, 0.75)}
              </RoundedBox>
              {/* Shirt collar and button line */}
              {[-1, 1].map((s) => (
                <mesh
                  key={s}
                  position={[s * 0.05, 0.56, 0.1]}
                  rotation={[0.5, 0, s * 0.6]}
                >
                  <boxGeometry args={[0.08, 0.06, 0.012]} />
                  {mat("#25262c", 0.7)}
                </mesh>
              ))}
              <mesh position={[0, 0.3, 0.131]}>
                <boxGeometry args={[0.012, 0.5, 0.004]} />
                {mat("#2c2d33", 0.6)}
              </mesh>
            </>
          )}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.055, 0.065, 0.1, 16]} />
            {mat(look.skin, 0.55)}
          </mesh>
          <Arm
            side={-1}
            x={shoulderX}
            y={0.5}
            pose={pose.armR}
            sleeve={top}
            skin={look.skin}
            cuff={gf ? "#a77a48" : undefined}
            item={rightHand}
          />
          <Arm
            side={1}
            x={shoulderX}
            y={0.5}
            pose={pose.armL}
            sleeve={top}
            skin={look.skin}
            cuff={gf ? "#a77a48" : undefined}
            item={leftHand}
          />
          <group
            position={[0, 0.78, 0]}
            rotation={[pose.headTilt, pose.headTurn, 0]}
          >
            <mesh scale={gf ? [0.95, 1.05, 0.98] : [1, 1.04, 1]}>
              <sphereGeometry args={[0.17, 40, 40]} />
              {mat(look.skin, 0.5)}
            </mesh>
            {/* Jaw */}
            <mesh
              position={[0, -0.08, 0.03]}
              scale={gf ? [0.85, 0.7, 0.85] : [0.95, 0.75, 0.9]}
            >
              <sphereGeometry args={[0.13, 24, 24]} />
              {mat(look.skin, 0.5)}
            </mesh>
            <Face look={look} pose={pose} />
            {gf ? <GfHair /> : <LeeHair />}
          </group>
        </group>
      </group>
    </group>
  );
};
