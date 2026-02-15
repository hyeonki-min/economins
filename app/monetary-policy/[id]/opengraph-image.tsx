import { ImageResponse } from "next/og";
import { MonetaryPolicyBrief } from "@/app/lib/definitions";
import { fetchDataset } from "@/app/lib/fetch-data";
import { getKoreanMeetingDate } from "@/app/lib/policy";

export const size = {
  width: 1200,
  height: 630,
};

type Props = {
  params: Promise<{ id: string }>
};

export default async function OgImage({ params }: Props) {
  const { id } = await params;
  const koreanDate = getKoreanMeetingDate(id);
  const decisions = await fetchDataset<MonetaryPolicyBrief>(`monetary-policy/${id}/bok-decision`);
  
return new ImageResponse(
  (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "28px 32px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#111827",
      }}
    >
      {/* 상단 브랜드 */}
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#6b7280",
          letterSpacing: "-0.01em",
        }}
      >
        ECONOMINS · 통화정책
      </div>

      {/* 중앙 콘텐츠 */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            marginBottom: 8,
            lineHeight: 1.2,
          }}
        >
          {koreanDate} 통화정책방향
        </div>

        <div
          style={{
            fontSize: 18,
            color: "#374151",
            lineHeight: 1.4,
            maxWidth: "90%",
          }}
        >
          {decisions?.[0]?.title ??
            "한국은행의 기준금리 결정을 확인하세요."}
        </div>
      </div>

      {/* 하단 도메인 */}
      <div
        style={{
          fontSize: 14,
          color: "#9ca3af",
        }}
      >
        economins.com
      </div>
    </div>
  ),
  {
    width: 476,
    height: 250,
  }
);
}
