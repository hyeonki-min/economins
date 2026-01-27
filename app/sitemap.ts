import { MetadataRoute } from "next";
import { VALID_POLICY_IDS } from "@/app/lib/policy";
import { fetchDataset } from '@/app/lib/fetch-data';
import { Indicator } from '@/app/lib/definitions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://economins.com";

  const allElement = await fetchDataset<Indicator>("main/main");
  const seriesIds = allElement.map((item) => item.id);

  const urls: MetadataRoute.Sitemap = [];

  urls.push({
    url: baseUrl,
    priority: 1.0,
  });

  urls.push({
    url: `${baseUrl}/overview`,
    priority: 0.9,
    changeFrequency: "monthly",
  });

  urls.push({
    url: `${baseUrl}/indicators`,
    priority: 0.9,
    changeFrequency: "monthly",
  });

  seriesIds.forEach((id) => {
    urls.push({
      url: `${baseUrl}/series/${id}`,
      priority: 0.8,
      changeFrequency: "weekly",
    });
  });

  VALID_POLICY_IDS.forEach((date) => {
    urls.push({
      url: `${baseUrl}/monetary-policy/${date}`,
      priority: 0.7,
      changeFrequency: "monthly",
    });
  });

  return urls;
}
