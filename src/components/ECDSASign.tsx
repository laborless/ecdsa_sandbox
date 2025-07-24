"use client";

import React, { useEffect, useState } from "react";
import { Stage, Layer, Circle, Line, Text } from "react-konva";

type ECPoint = { x: number; y: number };
const a = -1;
// const b = 1;
const p = 17;
const n = 19; // group order for simplification

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function modInv(n: number, mod: number): number {
  for (let i = 1; i < mod; i++) {
    if ((n * i) % mod === 1) return i;
  }
  throw new Error("No inverse");
}

function pointAdd(P: ECPoint, Q: ECPoint): ECPoint {
  if (P.x === Q.x && P.y === Q.y) {
    const s = ((3 * P.x ** 2 + a) * modInv(2 * P.y, p)) % p;
    const x = mod(s ** 2 - 2 * P.x, p);
    const y = mod(-P.y + s * (P.x - x), p);
    return { x, y };
  } else {
    const s = ((Q.y - P.y) * modInv(mod(Q.x - P.x, p), p)) % p;
    const x = mod(s ** 2 - P.x - Q.x, p);
    const y = mod(-P.y + s * (P.x - x), p);
    return { x, y };
  }
}

function scalarMult(k: number, G: ECPoint): ECPoint[] {
  let result = G;
  const steps = [G];
  for (let i = 1; i < k; i++) {
    result = pointAdd(result, G);
    steps.push(result);
  }
  return steps;
}

const scale = 25;
const offset = 50;

const ECDSASign: React.FC = () => {
  const G: ECPoint = { x: 5, y: 1 };
  const d = 3; // private key
  const z = 8; // hashed message
  const k = 2; // random nonce

  const [step, setStep] = useState(0);
  const kGSteps = scalarMult(k, G);
  const R = kGSteps[kGSteps.length - 1];
  const r = mod(R.x, n);
  const kinv = modInv(k, n);
  const s = mod(kinv * (z + r * d), n);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <Stage width={600} height={600}>
      <Layer>
        <Text text="ECDSA Signing Visualization" x={20} y={10} fontSize={18} />

        {step >= 1 && (
          <Text text={`Step 1: Compute R = kG`} x={20} y={40} fontSize={14} />
        )}
        {step >= 2 && (
          <Text text={`r = R.x mod n = ${R.x} mod ${n} = ${r}`} x={20} y={60} fontSize={14} />
        )}
        {step >= 3 && (
          <Text text={`s = k⁻¹(z + r·d) mod n = ${s}`} x={20} y={80} fontSize={14} />
        )}
        {step >= 4 && (
          <Text text={`Signature = (${r}, ${s})`} x={20} y={100} fontSize={16} fontStyle="bold" />
        )}

        {/* Axes */}
        <Line points={[offset, offset, offset, 500]} stroke="gray" />
        <Line points={[offset, 500, 500, 500]} stroke="gray" />

        {/* Draw G */}
        <Circle
          x={offset + G.x * scale}
          y={500 - G.y * scale}
          radius={6}
          fill="green"
        />
        <Text text="G" x={offset + G.x * scale + 6} y={500 - G.y * scale - 6} fontSize={12} />

        {/* Animate kG */}
        {kGSteps.map((pt, i) => (
          <Circle
            key={i}
            x={offset + pt.x * scale}
            y={500 - pt.y * scale}
            radius={5}
            fill={i <= step ? "blue" : "lightgray"}
          />
        ))}

        {/* R = kG */}
        {step >= 1 && (
          <>
            <Circle
              x={offset + R.x * scale}
              y={500 - R.y * scale}
              radius={6}
              fill="red"
            />
            <Text
              text="R"
              x={offset + R.x * scale + 6}
              y={500 - R.y * scale - 6}
              fontSize={12}
            />
          </>
        )}
      </Layer>
    </Stage>
  );
};

export default ECDSASign;
