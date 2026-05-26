import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          borderRadius: "36px",
          fontSize: "100px",
          fontWeight: 700,
          color: "#00ff41",
          fontFamily: "monospace",
        }}
      >
        &gt;_
      </div>
    ),
    { ...size }
  );
}
