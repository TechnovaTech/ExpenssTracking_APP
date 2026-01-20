import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const IMAGES_FILE = join(process.cwd(), 'images.json');
const UPLOADS_DIR = join(process.cwd(), 'uploads');

function loadImages() {
  if (existsSync(IMAGES_FILE)) {
    return JSON.parse(readFileSync(IMAGES_FILE, 'utf-8'));
  }
  return [];
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userEmail = url.searchParams.get('userEmail')?.toLowerCase().trim();
    const fileName = url.searchParams.get('fileName');

    if (fileName) {
      // Serve specific image file
      const filePath = join(UPLOADS_DIR, fileName);
      console.log('Looking for image at:', filePath);
      
      if (existsSync(filePath)) {
        const fileBuffer = readFileSync(filePath);
        const ext = fileName.toLowerCase().split('.').pop();
        let contentType = 'image/jpeg';
        
        if (ext === 'png') contentType = 'image/png';
        else if (ext === 'gif') contentType = 'image/gif';
        else if (ext === 'webp') contentType = 'image/webp';
        
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=31536000',
          },
        });
      } else {
        console.log('Image file not found:', filePath);
        // Return a placeholder image
        const placeholderSvg = `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="#F3F4F6"/>
          <path d="M35 40H65V60H35V40Z" fill="#9CA3AF"/>
          <text x="50" y="75" text-anchor="middle" fill="#6B7280" font-size="8">No Image</text>
        </svg>`;
        
        return new NextResponse(placeholderSvg, {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    } else {
      // Return image metadata
      const images = loadImages();
      const userImages = userEmail 
        ? images.filter((img: any) => img.userEmail === userEmail)
        : images;

      return NextResponse.json({ 
        images: userImages
      }, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }
  } catch (error) {
    console.error('Image API error:', error);
    return NextResponse.json({ message: 'Failed to get images' }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}