"use client";

import React, { useEffect, useState } from "react";
import { Stage, Layer, Circle, Line, Text } from "react-konva";

type ECPoint = { x: number; y: number };
const a = -1;
// const b = 1;
const p = 17;
// const steps = 10;



// Modular inverse helper
function modInv(n: number, mod: number): number {
  for (let i = 1; i < mod; i++) {
    if ((n * i) % mod === 1) return i;
  }
  throw new Error("No inverse")
}

// Point addition over EC
function pointAdd(P: ECPoint, Q: ECPoint): ECPoint {
  if (P.x === Q.x && P.y === Q.y) {
    const s = ((3 * P.x ** 2 + a) * modInv(2 * P.y, p)) % p;
    const x = (s ** 2 - 2 * P.x + p) % p;
    const y = (-P.y + s * (P.x - x) + p * 2) % p;
    return { x, y };
  } else {
    const s = ((Q.y - P.y) * modInv(Q.x - P.x + p, p)) % p;
    const x = (s ** 2 - P.x - Q.x + p * 2) % p;
    const y = (-P.y + s * (P.x - x) + p * 2) % p;
    return { x, y };
  }
}

// Scalar multiplication
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

const ECDCurve: React.FC = () => {
  const [step, setStep] = useState(0);

  const G: ECPoint = { x: 5, y: 1 }; // Base point
  const privateKey = 7;              // k
  const path = scalarMult(privateKey, G); // kG steps

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1 <= path.length - 1 ? prev + 1 : prev));
    }, 1000);
    return () => clearInterval(interval);
  }, [path.length]);

  return (
    <Stage width={600} height={600}>
      <Layer>
        <Text text={`ECDSA: kG Animation (k = ${privateKey})`} x={20} y={10} fontSize={18} />
        <Text text={`G = (${G.x}, ${G.y})`} x={20} y={35} fontSize={14} />
        <Text text={`kG = (${path[step].x}, ${path[step].y})`} x={20} y={55} fontSize={14} />

        {/* Axes */}
        <Line points={[offset, offset, offset, 500]} stroke="gray" />
        <Line points={[offset, 500, 500, 500]} stroke="gray" />

        {/* All points in path */}
        {path.map((pt, i) => (
          <Circle
            key={i}
            x={offset + pt.x * scale}
            y={500 - pt.y * scale}
            radius={5}
            fill={i <= step ? "blue" : "lightgray"}
          />
        ))}

        {/* Highlight G and kG */}
        <Circle
          x={offset + G.x * scale}
          y={500 - G.y * scale}
          radius={6}
          fill="green"
        />
        <Text text="G" x={offset + G.x * scale + 6} y={500 - G.y * scale - 6} fontSize={12} />

        <Circle
          x={offset + path[step].x * scale}
          y={500 - path[step].y * scale}
          radius={6}
          fill="red"
        />
        <Text
          text="kG"
          x={offset + path[step].x * scale + 6}
          y={500 - path[step].y * scale - 6}
          fontSize={12}
        />
      </Layer>
    </Stage>
  );
};

export default ECDCurve;
