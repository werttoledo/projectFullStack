import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/tareas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('PUT /api/tareas/:id error:', error);
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const usuario_id = url.searchParams.get('usuario_id');
    const backendUrl = usuario_id ? `${BACKEND_URL}/api/tareas/${id}?usuario_id=${usuario_id}` : `${BACKEND_URL}/api/tareas/${id}`;
    const response = await fetch(backendUrl, { method: 'DELETE' });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('DELETE /api/tareas/:id error:', error);
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}
