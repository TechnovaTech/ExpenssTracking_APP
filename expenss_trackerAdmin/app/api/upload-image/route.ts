import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const UPLOADS_DIR = join(process.cwd(), 'uploads');
const IMAGES_FILE = join(process.cwd(), 'images.json');

// Ensure uploads directory exists
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

function loadImages() {
  if (existsSync(IMAGES_FILE)) {
    return JSON.parse(readFileSync(IMAGES_FILE, 'utf-8'));
  }
  return [];
}

function saveImages(images: any[]) {
  writeFileSync(IMAGES_FILE, JSON.stringify(images, null, 2));
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: Request) {
  try {
    const { userEmail, transactionType, imageData, fileName } = await request.json();
    
    if (imageData && userEmail && fileName) {
      // Save actual image file from base64
      const buffer = Buffer.from(imageData, 'base64');
      const filePath = join(UPLOADS_DIR, fileName);
      
      writeFileSync(filePath, buffer);
      
      const images = loadImages();
      const newImage = {
        id: Date.now().toString(),
        userEmail: userEmail.toLowerCase().trim(),
        fileName: fileName,
        originalName: fileName,
        filePath,
        transactionType,
        uploadedAt: new Date().toISOString()
      };
      
      images.push(newImage);
      saveImages(images);
      
      return NextResponse.json({ 
        message: 'Image uploaded successfully',
        imageId: newImage.id,
        fileName: fileName
      }, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }
    
    return NextResponse.json({ message: 'Missing image data' }, { 
      status: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to upload image' }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}