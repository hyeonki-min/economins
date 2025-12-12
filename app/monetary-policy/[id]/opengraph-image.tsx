import { ImageResponse } from "next/og";
import { MonetaryPolicyBrief } from "@/app/lib/definitions";
import { fetchDataset } from "@/app/lib/fetch-data";
import { getKoreanMeetingDate } from "@/app/lib/policy";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";


export default async function OgImage({ params }: { params: { id: string } }) {
  const id = params.id;
  const koreanDate = getKoreanMeetingDate(id);
  const decisions = await fetchDataset<MonetaryPolicyBrief>(`monetary-policy/${id}/bok-decision`);
  
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          padding: "10px 10px",
          fontFamily: "system-ui, sans-serif",
          color: "#111827",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 24,
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          {koreanDate} 통화정책방향 요약
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 18,
            color: "#374151",
            lineHeight: 1.3,
          }}
        >
          {decisions?.[0]?.title ?? "한국은행의 기준금리 결정을 참고하세요."}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 20,
            fontSize: 14,
            color: "#6b7280",
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
