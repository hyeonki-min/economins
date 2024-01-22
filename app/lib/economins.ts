'use server';

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";

export default async function createPresignedUrl({ key }: {key: string}) {
    const client = new S3Client({ 
        region: process.env.AWS_REGION,
        credentials: fromEnv(),
    })
    const command = new GetObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: key+".json" });
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    const rest = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    })
    if (!rest.ok) {
        return false;
    }
    return rest.json();
}