'use server';

import 'server-only';

export async function fetchDataset<T>(
  key: string
): Promise<T[]> {
  const baseUrl = process.env.CDN_BASE_URL;
  if (!baseUrl) throw new Error('Missing baseUrl');

  const url = `${baseUrl}/${key}.json`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    console.error('fetchDataset failed:', res.status);
    return [];
  }

  const data = await res.json();
  return data as T[];
}

export async function fetchObject<T>(
  key: string
): Promise<T | null> {
  const baseUrl = process.env.CLOUDFRONT_BASE_URL;
  if (!baseUrl) throw new Error('Missing baseUrl');

  const url = `${baseUrl}/${key}.json`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    console.error('fetchObject failed:', res.status);
    return null;
  }

  const data = await res.json();
  return data as T;
}
