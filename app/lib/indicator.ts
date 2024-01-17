'use server';

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";

export default async function createPresignedUrl({ bucket, key }: {bucket: string, key: string}) {
    const client = new S3Client({ 
        region: 'ap-northeast-2',
        credentials: fromEnv(),
    })
    
    const command = new GetObjectCommand({ Bucket: bucket, Key: 'indicator/base_rate_korea.json' });
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    const rest = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    })
    if (!rest.ok) {
        throw new Error('Failed to fetch data');
    }
    return rest.json();
}