import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'i18n API endpoint' });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'i18n API endpoint' });
}