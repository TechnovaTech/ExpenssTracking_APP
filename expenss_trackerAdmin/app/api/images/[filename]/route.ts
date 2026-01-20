import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const UPLOADS_DIR = join(process.cwd(), 'uploads');

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    const filePath = join(UPLOADS_DIR, filename);

    if (!existsSync(filePath)) {
      return NextResponse.json({ message: 'Image not found' }, { 
        status: 404,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    const fileBuffer = readFileSync(filePath);
    const fileExtension = filename.split('.').pop()?.toLowerCase();
    
    let contentType = 'image/jpeg';
    if (fileExtension === 'png') contentType = 'image/png';
    else if (fileExtension === 'gif') contentType = 'image/gif';
    else if (fileExtension === 'webp') contentType = 'image/webp';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to serve image' }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}