import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const usuario_id = url.searchParams.get('usuario_id');
    
    if (!usuario_id) {
      return NextResponse.json(
        { error: 'usuario_id es requerido' },
        { status: 400 }
      );
    }
    
    const response = await fetch(`${BACKEND_URL}/api/categorias?usuario_id=${usuario_id}`);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('GET /api/categorias error:', error);
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('POST /api/categorias error:', error);
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}
