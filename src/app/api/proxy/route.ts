import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get('url');

  if (!fileUrl) {
    return new NextResponse('URL parameter is missing', { status: 400 });
  }

  const response = await fetch(fileUrl);
  const blob = await response.blob();

  const headers = new Headers();
  headers.set('Content-Type', blob.type);
  headers.set(
    'Content-Disposition',
    `attachment; filename=${fileUrl.split('/').pop()}`,
  );

  return new NextResponse(blob.stream(), {
    headers,
  });
}
