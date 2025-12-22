// src/app/api/delete-image/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { publicId } = body;

    if (!publicId || typeof publicId !== 'string') {
      return NextResponse.json(
        { error: 'Valid publicId is required' },
        { status: 400 }
      );
    }

    // Cloudinary से डिलीट (invalidate: true से CDN cache क्लियर होगा)
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,  // CDN cache invalidate — इमेज तुरंत गायब हो जाएगी
    });

    if (result.result === 'ok' || result.result === 'not found') {
      return NextResponse.json({ success: true, message: 'Image deleted successfully' });
    }

    console.warn('Cloudinary delete unexpected result:', result);
    return NextResponse.json(
      { error: 'Delete not confirmed', details: result },
      { status: 500 }
    );
  } catch (error) {
    console.error('Cloudinary delete API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image from Cloudinary' },
      { status: 500 }
    );
  }
}