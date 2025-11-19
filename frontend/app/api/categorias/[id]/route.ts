import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const requester_id = url.searchParams.get('requester_id');
    
    if (!requester_id) {
      return NextResponse.json({ error: 'requester_id es requerido' }, { status: 400 });
    }
    
    const backendUrl = `${BACKEND_URL}/api/categorias/${id}?requester_id=${requester_id}`;
    const response = await fetch(backendUrl, { method: 'DELETE' });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('DELETE /api/categorias/:id error:', error);
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}

