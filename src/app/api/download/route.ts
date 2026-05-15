export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');
    const fileName = searchParams.get('name') || 'arquivo';

    if (!fileUrl) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await fetch(fileUrl);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
    }

    const buffer = await response.arrayBuffer();

    // Extract extension from URL
    const urlPath = new URL(fileUrl).pathname;
    const extension = urlPath.split('.').pop()?.toLowerCase() || 'png';
    const finalFileName = `${fileName}.${extension}`;

    // Map extensions to correct MIME types
    const mimeTypes: Record<string, string> = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'pdf': 'application/pdf',
      'ai': 'application/postscript',
    };

    const contentType = mimeTypes[extension] || 'application/octet-stream';

    return new NextResponse(buffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${finalFileName}"`,
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}
