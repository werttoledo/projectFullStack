import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const usuario_id = url.searchParams.get('usuario_id');
    
    if (!usuario_id) {
      return NextResponse.json({ error: 'usuario_id es requerido' }, { status: 400 });
    }
    
    const backendUrl = `${BACKEND_URL}/api/categorias/${id}?usuario_id=${usuario_id}`;
    const response = await fetch(backendUrl, { method: 'DELETE' });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('DELETE /api/categorias/:id error:', error);
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}

