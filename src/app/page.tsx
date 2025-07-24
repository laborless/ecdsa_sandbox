"use client";

import Image from "next/image";
import EllipticCurveChart from "@/components/EllipticCurveChart";

import { useState, useEffect } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [length, setLength] = useState(32);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for system dark mode preference
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setIsDarkMode(prefersDark);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Predefined curves
  type CurvePresetKey = "secp256r1" | "secp256k1" | "example" | "small" | "custom";
  type CurvePreset = {
    a: number;
    b: number;
    p: number;
    name: string;
    description: string;
  };
  const curvePresets: Record<CurvePresetKey, CurvePreset> = {
    secp256r1: {
      a: -3,
      b: 41,
      p: 47,
      name: "secp256r1 (simplified)",
      description: "NIST P-256 curve used in TLS/SSL",
    },
    secp256k1: {
      a: 0,
      b: 7,
      p: 43,
      name: "secp256k1 (simplified)",
      description: "Bitcoin and Ethereum blockchain curve",
    },
    example: {
      a: -1,
      b: 1,
      p: 17,
      name: "Example Curve",
      description: "Simple curve for educational purposes",
    },
    small: {
      a: 2,
      b: 3,
      p: 11,
      name: "Small Field (p=11)",
      description: "Very small prime field for visualizing all points",
    },
    custom: {
      a: 0,
      b: 0,
      p: 23,
      name: "Custom",
      description: "Your own custom curve parameters",
    },
  };

  const [selectedCurve, setSelectedCurve] = useState<CurvePresetKey>("secp256r1");
  // secp256r1 parameters (truncated to smaller values for visualization)
  const [curveParams, setCurveParams] = useState({
    a: curvePresets.secp256r1.a,
    b: curvePresets.secp256r1.b,
  });
  const [modulus, setModulus] = useState(curvePresets.secp256r1.p);

  function generateRandomHex(length: number) {
    const bytes = new Uint8Array(length);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  return (
    <div
      className={`font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 pb-20 gap-8 sm:p-8 md:p-12 lg:p-20 ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"}`}
    >
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full max-w-7xl px-2 sm:px-4">
        <div className="fixed top-4 right-4 z-10">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-black hover:bg-gray-300"}`}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>
        {/* <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        /> */}
        <pre className="font-mono text-xs sm:text-sm leading-none text-center mb-4 select-none">
          {`
▄▄▄ . ▄▄· ·▄▄▄▄  .▄▄ ·  ▄▄▄· 
▀▄.▀·▐█ ▌▪██▪ ██ ▐█ ▀. ▐█ ▀█ 
▐▀▀▪▄██ ▄▄▐█· ▐█▌▄▀▀▀█▄▄█▀▀█ 
▐█▄▄▌▐███▌██. ██ ▐█▄▪▐█▐█ ▪▐▌
 ▀▀▀ ·▀▀▀ ▀▀▀▀▀•  ▀▀▀▀  ▀  ▀ 
.▄▄ ·  ▄▄▄·  ▐ ▄ ·▄▄▄▄  ▄▄▄▄·       ▐▄• ▄ 
▐█ ▀. ▐█ ▀█ •█▌▐███▪ ██ ▐█ ▀█▪▪      █▌█▌▪
▄▀▀▀█▄▄█▀▀█ ▐█▐▐▌▐█· ▐█▌▐█▀▀█▄ ▄█▀▄  ·██· 
▐█▄▪▐█▐█ ▪▐▌██▐█▌██. ██ ██▄▪▐█▐█▌.▐▌▪▐█·█▌
 ▀▀▀▀  ▀  ▀ ▀▀ █▪▀▀▀▀▀• ·▀▀▀▀  ▀█▄▀▪•▀▀ ▀▀
        `}
        </pre>
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="hexInput" className="font-semibold mb-1">
            Elliptic Curve (Weierstrass equation)
          </label>
          <span className="font-mono text-lg">
            y²= x³+ax+b / y²≡ x³+ax+b(mod N)
          </span>
          <ul className="font-mono list-inside list-disc text-sm/6 text-center sm:text-left">
            <li className="tracking-[-.01em]">Field F=ℝ / F=ℤₚ(p: prime number &gt; 2)</li>
            <li className="tracking-[-.01em]">Δ = -16(4a² + 27b²) ≠ 0</li>
            <li className="tracking-[-.01em]">a, b ∈ F</li>
            {/* <li className="tracking-[-.01em]">a, b ∈ ℝ or ℤ/Nℤ</li> */}
            <li className="tracking-[-.01em]">O: Point at infinity</li>
            <li className="tracking-[-.01em]">
              E(F) = &#123;(x,y) ∈ F × F : y² = x³ + ax + b&#125; ∪
              &#123;O&#125;
            </li>
          </ul>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 w-full">
            <div className="flex flex-col">
              <h3 className="text-center font-semibold mb-2 text-lg">
                Real Number Curve
              </h3>
              <p
                className={`text-xs text-center ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-2`}
              >
                Visualizes the curve over real numbers with both positive and
                negative coordinates
              </p>
              <div
                className={`border rounded p-4 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"} shadow-sm aspect-square w-full max-w-[350px] mx-auto flex items-center justify-center`}
              >
                <EllipticCurveChart
                  a={curveParams.a}
                  b={curveParams.b}
                  width={320}
                  height={320}
                  title="Real Number Curve"
                  showGrid={true}
                  showPoints={false}
                  responsive={true}
                  showCoordinates={true}
                  xAxisLabel="X"
                  yAxisLabel="Y"
                  externalTitle={true}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <h3 className="text-center font-semibold mb-2 text-lg">
                Zₚ Modular Curve ({curvePresets[selectedCurve].name})
              </h3>
              <p
                className={`text-xs text-center ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-2`}
              >
                Shows discrete points in finite field Zₚ where coordinates range
                from 0 to p-1
              </p>
              <div
                className={`border rounded p-4 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"} shadow-sm aspect-square w-full max-w-[350px] mx-auto flex items-center justify-center`}
              >
                <EllipticCurveChart
                  a={curveParams.a}
                  b={curveParams.b}
                  modulus={modulus}
                  width={320}
                  height={320}
                  title={`Modular Curve Zₚ (${curvePresets[selectedCurve].name})`}
                  showGrid={true}
                  showPoints={true}
                  responsive={true}
                  showCoordinates={true}
                  xAxisLabel="X"
                  yAxisLabel="Y"
                  externalTitle={true}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={`flex flex-col gap-2 w-full ${isDarkMode ? "text-white" : "text-black"}`}
        >
          <label className="font-semibold mb-1">Curve Parameters</label>
          <div className="flex flex-wrap gap-3 items-center mb-3">
            <div className="flex items-center">
              <label className="font-mono mr-2">Preset:</label>
              <select
                className="border rounded px-3 py-2 font-mono"
                value={selectedCurve}
                onChange={(e) => {
                  const selected = e.target.value as CurvePresetKey;
                  setSelectedCurve(selected);
                  if (selected !== "custom") {
                    setCurveParams({
                      a: curvePresets[selected].a,
                      b: curvePresets[selected].b,
                    });
                    setModulus(curvePresets[selected].p);
                  }
                }}
              >
                {Object.keys(curvePresets).map((curve) => (
                  <option key={curve} value={curve}>
                    {curvePresets[curve as CurvePresetKey].name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center">
              <label className="font-mono">a:</label>
              <input
                type="number"
                className={`border rounded ml-2 px-3 py-2 w-20 font-mono ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"}`}
                value={curveParams.a}
                onChange={(e) => {
                  setCurveParams({
                    ...curveParams,
                    a: parseInt(e.target.value) || 0,
                  });
                  setSelectedCurve("custom");
                }}
              />
            </div>
            <div className="flex items-center">
              <label className="font-mono">b:</label>
              <input
                type="number"
                className={`border rounded ml-2 px-3 py-2 w-20 font-mono ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"}`}
                value={curveParams.b}
                onChange={(e) => {
                  setCurveParams({
                    ...curveParams,
                    b: parseInt(e.target.value) || 0,
                  });
                  setSelectedCurve("custom");
                }}
              />
            </div>
            <div className="flex items-center">
              <label className="font-mono">p:</label>
              <input
                type="number"
                className={`border rounded ml-2 px-3 py-2 w-20 font-mono ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"}`}
                value={modulus}
                min={2}
                onChange={(e) => {
                  setModulus(parseInt(e.target.value) || 47);
                  setSelectedCurve("custom");
                }}
              />
            </div>
          </div>
          <div
            className={`mt-2 p-3 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} rounded text-xs`}
          >
            <p>
              <strong>Note:</strong> These are simplified values for
              visualization. The modular curve shows points in Zₚ (integers mod
              p) where both x and y range from 0 to p-1. The actual curve
              parameters are much larger.
            </p>
            <p className="mt-1">
              <strong>Curve:</strong> {curvePresets[selectedCurve].description}
            </p>
            {selectedCurve === "secp256r1" && (
              <>
                <p className="mt-1">
                  <span className="font-semibold">secp256r1 a:</span>{" "}
                  0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC
                </p>
                <p>
                  <span className="font-semibold">secp256r1 b:</span>{" "}
                  0x5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B
                </p>
                <p>
                  <span className="font-semibold">secp256r1 p:</span>{" "}
                  0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF
                </p>
              </>
            )}
            {selectedCurve === "secp256k1" && (
              <>
                <p className="mt-1">
                  <span className="font-semibold">secp256k1 a:</span> 0
                </p>
                <p>
                  <span className="font-semibold">secp256k1 b:</span> 7
                </p>
                <p>
                  <span className="font-semibold">secp256k1 p:</span>{" "}
                  0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full max-w-2xl">
          <label
            htmlFor="hexInput"
            className={`font-semibold mb-1 ${isDarkMode ? "text-gray-200" : ""}`}
          >
            Private Key (Hexadecimal ASCII)
          </label>
          <div className="flex gap-2">
            <input
              id="hexInput"
              type="text"
              className={`border rounded px-3 py-2 w-full font-mono ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white text-black"}`}
              placeholder="Enter hex or generate random"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <select
              className={`border rounded px-2 py-2 font-mono ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white text-black"}`}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            >
              {[16, 24, 32, 48, 64].map((l) => (
                <option key={l} value={l}>
                  {l} bytes
                </option>
              ))}
            </select>
            <button
              className={`${isDarkMode ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"} text-white px-4 py-2 rounded font-medium`}
              type="button"
              onClick={() => setInputValue(generateRandomHex(length))}
            >
              Generate
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-md">
          <label
            htmlFor="hexInput"
            className={`font-semibold mb-1 ${isDarkMode ? "text-gray-200" : ""}`}
          >
            HASH
          </label>
          <span
            className={`font-mono ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            TODO:
          </span>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-2xl">
          <label
            htmlFor="hexInput"
            className={`font-semibold mb-1 ${isDarkMode ? "text-gray-200" : ""}`}
          >
            Signature
          </label>
          <span
            className={`font-mono ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            TODO:
          </span>
        </div>
        {/* <h1 className="text-2xl font-bold mb-4">ECDSA Signature Animation</h1>
        <ECDSASign /> */}
        <div className="flex flex-col gap-2 w-full max-w-2xl">
          <label
            htmlFor="hexInput"
            className={`font-semibold mb-1 ${isDarkMode ? "text-gray-200" : ""}`}
          >
            References
          </label>
          <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
            <li className="tracking-[-.01em]">Reference 1</li>
            <li className="tracking-[-.01em]">Reference 2</li>
          </ol>
        </div>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer
        className={`row-start-3 flex gap-[24px] flex-wrap items-center justify-center ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
      >
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
