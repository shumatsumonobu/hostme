import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a1a0a",
          borderRadius: "6px",
          fontSize: "20px",
          fontWeight: 700,
          color: "#00ff41",
          fontFamily: "monospace",
        }}
      >
        &gt;
      </div>
    ),
    { ...size }
  );
}
