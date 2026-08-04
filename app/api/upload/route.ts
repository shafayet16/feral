import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2, R2_BUCKET_NAME } from '@/lib/r2';

// Safe default in case NEXT_PUBLIC_R2_PUBLIC_URL is missing in .env
const R2_PUBLIC_DOMAIN = (
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-fab4e79b5407486695278c53c8ded542.r2.dev'
).replace(/\/$/, ''); // Removes trailing slash if present

export async function POST(request: Request) {
  try {
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'filename and contentType are required' },
        { status: 400 }
      );
    }

    const extension = filename.split('.').pop();
    const key = `products/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });
    const publicUrl = `${R2_PUBLIC_DOMAIN}/${key}`;

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (error: any) {
    console.error('R2 Presigned URL Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}