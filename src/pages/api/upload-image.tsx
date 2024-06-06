import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const config = {
    runtime: 'edge',
  };

export default async function upload(request, response) {
  try {
    const form = await request.formData();
    const file = form.get('file') as File;
    const blob = await put(file.name, file, { access: 'public' });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error uploading file:', error);
    
    return NextResponse.error(new Error('Failed to upload file'));
  }
}
