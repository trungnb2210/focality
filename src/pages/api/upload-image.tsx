import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function upload(request: NextRequest, response: NextResponse) {
  try {
    const form = await request.formData();
    const file = form.get('file') as File;
    const blob = await put(file.name, file, { access: 'public' });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error uploading file:', error);
    
    return NextResponse.error();
  }
}
