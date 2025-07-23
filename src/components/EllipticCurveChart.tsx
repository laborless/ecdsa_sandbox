"use client";

import React from "react";
import { Stage, Layer, Circle, Line, Text } from "react-konva";

interface EllipticCurveChartProps {
  a: number; // Parameter a in y² = x³ + ax + b
  b: number; // Parameter b
  modulus?: number; // For modular arithmetic (optional)
  width?: number; // Canvas width
  height?: number; // Canvas height
  showGrid?: boolean; // Whether to show grid lines
  showPoints?: boolean; // Whether to show individual points
  title?: string; // Chart title
  responsive?: boolean; // Whether the chart should be responsive
  showCoordinates?: boolean; // Whether to show coordinates on hover
  xAxisLabel?: string; // Label for x-axis
  yAxisLabel?: string; // Label for y-axis
  externalTitle?: boolean; // Whether the title is displayed externally
  isDarkMode?: boolean; // Whether to use dark mode colors
}

const EllipticCurveChart: React.FC<EllipticCurveChartProps> = ({
  a,
  b,
  modulus,
  width = 300,
  height = 300,
  showGrid = true,
  showPoints = true,
  title = "Elliptic Curve",
  responsive = true,
  showCoordinates = true,
  xAxisLabel = "x",
  yAxisLabel = "y",
  externalTitle = false,
  isDarkMode = false,
}) => {
  const [hoveredPoint, setHoveredPoint] = React.useState<{
    x: number;
    y: number;
  } | null>(null);

  // Make the chart square by using the minimum dimension
  const size = Math.min(width, height);

  // Scale and offset for plotting
  const scale = modulus
    ? size / (modulus * 1.5) // Increase scale factor to spread points better
    : size / 20;

  // For modular curves, adjust the offset to show only positive values (0 to p-1)
  const offsetX = modulus ? 40 : size / 2;
  const offsetY = modulus ? size - 40 : size / 2;

  // Theme colors based on dark/light mode
  const colors = {
    background: isDarkMode ? "#1a1a1a" : "#ffffff",
    text: isDarkMode ? "#e0e0e0" : "#333333",
    grid: isDarkMode ? "#3a3a3a" : "#e0e0e0",
    axes: isDarkMode ? "#888888" : "#555555",
    point: isDarkMode ? "#ff6b6b" : "#e74c3c",
    realCurve: isDarkMode ? "#4dabf7" : "#3498db",
    highlight: isDarkMode ? "rgba(255, 255, 0, 0.2)" : "rgba(255, 255, 0, 0.3)",
    coordinateLines: isDarkMode ? "#4faeba" : "#2980b9",
    valid: isDarkMode ? "#43be65" : "#27ae60",
    invalid: isDarkMode ? "#fa5252" : "#c0392b",
  };

  // Function to calculate y²
  const getYSquared = (x: number): number => {
    return x * x * x + a * x + b;
  };

  // Function to get y from x for elliptic curve equation
  const getY = (x: number): number[] => {
    const ySquared = getYSquared(x);
    if (ySquared < 0 && !modulus) return [];

    if (modulus) {
      // For modular arithmetic
      const points: number[] = [];
      for (let y = 0; y < modulus; y++) {
        // Handle negative values properly in modular arithmetic
        let ySquaredMod = ((ySquared % modulus) + modulus) % modulus;
        let y2Mod = (((y * y) % modulus) + modulus) % modulus;

        if (y2Mod === ySquaredMod) {
          points.push(y);
        }
      }
      return points;
    } else {
      // For real numbers
      const y = Math.sqrt(ySquared);
      return [y, -y]; // Both positive and negative y values
    }
  };

  // Generate all points on the curve
  const generatePoints = (): { x: number; y: number }[] => {
    const points: { x: number; y: number }[] = [];

    if (modulus) {
      // For modular arithmetic
      for (let x = 0; x < modulus; x++) {
        try {
          const yValues = getY(x);
          for (const y of yValues) {
            points.push({ x, y });
          }
        } catch (e) {
          // Skip points where we can't compute y
        }
      }
    } else {
      // For real numbers
      const stepSize = 0.1;
      const range = 10; // Plot x from -range to +range

      for (let x = -range; x <= range; x += stepSize) {
        try {
          const yValues = getY(x);
          for (const y of yValues) {
            points.push({ x, y });
          }
        } catch (e) {
          // Skip points where we can't compute y
        }
      }
    }

    return points;
  };

  // Generate grid lines
  const generateGridLines = () => {
    const lines = [];
    const gridStep = modulus ? 1 : 1;
    const range = modulus ? modulus : 10;

    if (modulus) {
      // For modular arithmetic, only show positive grid (0 to p-1)
      for (let x = 0; x <= modulus; x += gridStep) {
        const xPos = offsetX + x * scale;
        if (xPos >= 0 && xPos <= width) {
          lines.push(
            <Line
              key={`vgrid-${x}`}
              points={[xPos, 0, xPos, height]}
              stroke={colors.grid}
              strokeWidth={x === 0 ? 1.5 : 0.5}
            />,
          );
        }
      }

      // Horizontal grid lines (0 to p-1)
      for (let y = 0; y <= modulus; y += gridStep) {
        const yPos = offsetY - y * scale;
        if (yPos >= 0 && yPos <= height) {
          lines.push(
            <Line
              key={`hgrid-${y}`}
              points={[0, yPos, width, yPos]}
              stroke={colors.grid}
              strokeWidth={y === 0 ? 1.5 : 0.5}
            />,
          );
        }
      }
    } else {
      // For real numbers, show both positive and negative
      // Vertical grid lines
      for (let x = -range; x <= range; x += gridStep) {
        const xPos = offsetX + x * scale;
        if (xPos >= 0 && xPos <= width) {
          lines.push(
            <Line
              key={`vgrid-${x}`}
              points={[xPos, 0, xPos, height]}
              stroke={colors.grid}
              strokeWidth={x === 0 ? 1.5 : 0.5}
            />,
          );
        }
      }

      // Horizontal grid lines
      for (let y = -range; y <= range; y += gridStep) {
        const yPos = offsetY - y * scale;
        if (yPos >= 0 && yPos <= height) {
          lines.push(
            <Line
              key={`hgrid-${y}`}
              points={[0, yPos, width, yPos]}
              stroke={colors.grid}
              strokeWidth={y === 0 ? 1.5 : 0.5}
            />,
          );
        }
      }
    }

    return lines;
  };

  // Draw continuous curve for real number version
  const drawContinuousCurve = () => {
    if (modulus) return null;

    const points: number[] = [];
    const stepSize = 0.05;
    const range = 10;

    for (let x = -range; x <= range; x += stepSize) {
      try {
        const yValues = getY(x);
        if (yValues.length > 0) {
          const xPos = offsetX + x * scale;
          const yPos1 = offsetY - yValues[0] * scale;

          if (points.length === 0) {
            points.push(xPos, yPos1);
          } else {
            // Check for discontinuities
            const lastX = points[points.length - 2];
            const lastY = points[points.length - 1];
            const distance = Math.sqrt(
              Math.pow(xPos - lastX, 2) + Math.pow(yPos1 - lastY, 2),
            );

            if (distance < scale * 1) {
              points.push(xPos, yPos1);
            } else {
              // Start a new line for discontinuities
              return (
                <>
                  <Line
                    points={points}
                    stroke="blue"
                    strokeWidth={1.5}
                    tension={0.5}
                    bezier
                  />
                  <Line
                    points={points.map((p, i) => {
                      if (i % 2 === 1) {
                        // Flip y coordinates for the second curve
                        return 2 * offsetY - p;
                      }
                      return p;
                    })}
                    stroke="blue"
                    strokeWidth={1.5}
                    tension={0.5}
                    bezier
                  />
                </>
              );
            }
          }
        }
      } catch (e) {
        // Skip points where we can't compute y
      }
    }

    return (
      <>
        <Line
          points={points}
          stroke={colors.realCurve}
          strokeWidth={1.5}
          tension={0.5}
          bezier
        />
        <Line
          points={points.map((p, i) => {
            if (i % 2 === 1) {
              // Flip y coordinates for the second curve
              return 2 * offsetY - p;
            }
            return p;
          })}
          stroke={colors.realCurve}
          strokeWidth={1.5}
          tension={0.5}
          bezier
        />
      </>
    );
  };

  // Function to render coordinate marker lines for a specific point
  const renderCoordinateMarkers = (point: { x: number; y: number }) => {
    const xPos = offsetX + point.x * scale;
    const yPos = offsetY - point.y * scale;

    return (
      <React.Fragment>
        {/* Vertical line to X-axis */}
        <Line
          points={[xPos, yPos, xPos, offsetY]}
          stroke={colors.coordinateLines}
          strokeWidth={1}
          dash={[2, 2]}
        />
        {/* Horizontal line to Y-axis */}
        <Line
          points={[offsetX, yPos, xPos, yPos]}
          stroke={colors.coordinateLines}
          strokeWidth={1}
          dash={[2, 2]}
        />
      </React.Fragment>
    );
  };

  // Calculate verification values for a point (to confirm it's on the curve)
  const calculateVerification = (point: { x: number; y: number }) => {
    // Calculate y²
    let ySquared = point.y * point.y;
    if (modulus) {
      ySquared = ((ySquared % modulus) + modulus) % modulus;
    }

    // Calculate x³ + ax + b
    let rightSide = point.x * point.x * point.x + a * point.x + b;
    if (modulus) {
      rightSide = ((rightSide % modulus) + modulus) % modulus;
    }

    return { ySquared, rightSide };
  };

  const points = generatePoints();

  return (
    <Stage
      width={size}
      height={size}
      style={
        responsive
          ? {
              width: "100%",
              maxWidth: size,
              margin: "0 auto",
              background: colors.background,
              borderRadius: "4px",
            }
          : { background: colors.background, borderRadius: "4px" }
      }
    >
      <Layer>
        {/* Title - only shown if not external */}
        {!externalTitle && (
          <Text
            text={title}
            x={10}
            y={10}
            fontSize={14}
            fontStyle="bold"
            fill={colors.text}
          />
        )}

        {/* Curve equation - positioned based on curve type */}
        <Text
          text={`y² ${modulus ? "≡" : "="} x³ + ${a}x + ${b}${modulus ? ` (mod ${modulus})` : ""}`}
          x={modulus ? size - 150 : 10}
          y={externalTitle ? 10 : 30}
          fontSize={12}
          fill={colors.text}
          fontStyle="bold"
          align={modulus ? "right" : "left"}
        />

        {/* Grid lines */}
        {showGrid && generateGridLines()}

        {/* X and Y axes */}
        {modulus ? (
          <>
            <Line
              points={[offsetX, 0, offsetX, size]}
              stroke={colors.axes}
              strokeWidth={1.5}
            />
            <Line
              points={[0, offsetY, size, offsetY]}
              stroke={colors.axes}
              strokeWidth={1.5}
            />
          </>
        ) : (
          <>
            <Line
              points={[0, offsetY, size, offsetY]}
              stroke={colors.axes}
              strokeWidth={1}
            />
            <Line
              points={[offsetX, 0, offsetX, size]}
              stroke={colors.axes}
              strokeWidth={1}
            />
          </>
        )}

        {/* Axis labels */}
        {modulus ? (
          <>
            <Text
              text={xAxisLabel}
              x={size - 15}
              y={offsetY + 10}
              fontSize={12}
              fill={colors.text}
              fontStyle="bold"
            />
            <Text
              text={yAxisLabel}
              x={offsetX - 20}
              y={15}
              fontSize={12}
              fill={colors.text}
              fontStyle="bold"
            />
          </>
        ) : (
          <>
            <Text
              text={xAxisLabel}
              x={size - 15}
              y={offsetY + 5}
              fontSize={12}
              fill={colors.text}
              fontStyle="bold"
            />
            <Text
              text={yAxisLabel}
              x={offsetX + 5}
              y={15}
              fontSize={12}
              fill={colors.text}
              fontStyle="bold"
            />
          </>
        )}

        {/* Draw continuous curve for real numbers */}
        {!modulus && drawContinuousCurve()}

        {/* Draw coordinate markers for hovered point */}
        {showCoordinates &&
          hoveredPoint &&
          renderCoordinateMarkers(hoveredPoint)}

        {/* Draw individual points */}
        {showPoints &&
          points.map((point, index) => (
            <Circle
              key={index}
              x={offsetX + point.x * scale}
              y={offsetY - point.y * scale}
              radius={modulus && modulus > 30 ? 3 : responsive ? 3.5 : 4}
              fill={modulus ? colors.point : colors.realCurve}
              opacity={0.9}
              strokeWidth={0.5}
              stroke={colors.stroke}
              listening={true}
              onMouseEnter={() => setHoveredPoint(point)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

        {/* Coordinate Legend */}
        {showCoordinates && hoveredPoint && (
          <Text
            text={`(${hoveredPoint.x}, ${hoveredPoint.y})`}
            x={10}
            y={height - 25}
            fontSize={12}
            fill={colors.text}
            fontStyle="bold"
            padding={3}
            background={
              isDarkMode ? "rgba(40, 40, 40, 0.8)" : "rgba(255, 255, 255, 0.8)"
            }
            cornerRadius={3}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default EllipticCurveChart;
