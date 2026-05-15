export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Allowed file types with magic bytes validation
const ALLOWED_FILES = {
  'png': { mimeType: 'image/png', magicBytes: [0x89, 0x50, 0x4e, 0x47] },
  'pdf': { mimeType: 'application/pdf', magicBytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  'ai': { mimeType: 'application/postscript', magicBytes: [0x25, 0x21, 0x50, 0x53] }, // %!PS
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFileMagicBytes(buffer: Uint8Array, expectedBytes: number[]): boolean {
  if (buffer.length < expectedBytes.length) return false;
  for (let i = 0; i < expectedBytes.length; i++) {
    if (buffer[i] !== expectedBytes[i]) return false;
  }
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const allowedFile = ALLOWED_FILES[fileExtension as keyof typeof ALLOWED_FILES];

    if (!allowedFile) {
      return NextResponse.json(
        { error: 'File type not allowed. Only PNG, PDF, and AI files are accepted.' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    // Validate magic bytes
    if (!validateFileMagicBytes(uint8Array, allowedFile.magicBytes)) {
      return NextResponse.json(
        { error: 'Invalid file content. The file does not match the expected type.' },
        { status: 400 }
      );
    }

    const sanitizedName = file.name
      .toLowerCase()
      .replace(/[^\w.-]/g, '_')
      .replace(/\s+/g, '_');
    const fileName = `${Date.now()}-${sanitizedName}`;

    const { data, error } = await supabase.storage
      .from('Arquivo-Artes')
      .upload(`quotes/${fileName}`, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    const { data: publicData } = supabase.storage
      .from('Arquivo-Artes')
      .getPublicUrl(`quotes/${fileName}`);

    return NextResponse.json({
      url: publicData.publicUrl,
      fileName: file.name,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
