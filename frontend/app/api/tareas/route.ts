import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const usuario_id = url.searchParams.get('usuario_id');
    const categoria_id = url.searchParams.get('categoria_id');
    let backendUrl = `${BACKEND_URL}/api/tareas?`;
    const params = new URLSearchParams();
    if (usuario_id) params.append('usuario_id', usuario_id);
    if (categoria_id) params.append('categoria_id', categoria_id);
    backendUrl += params.toString();
    const response = await fetch(backendUrl);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('GET /api/tareas error:', error);
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/tareas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('POST /api/tareas error:', error);
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}
