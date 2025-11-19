// frontend/app/api/tasks/route.ts
// Proxy endpoint que redirige las solicitudes al backend en puerto 5000

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const usuarioId = request.nextUrl.searchParams.get('usuario_id');
    const categoriaId = request.nextUrl.searchParams.get('categoria_id');

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'usuario_id es requerido' },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({ usuario_id: usuarioId });
    if (categoriaId) {
      params.append('categoria_id', categoriaId);
    }

    const response = await fetch(`${BACKEND_URL}/api/tasks?${params.toString()}`);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('GET /api/tasks error:', error);
    return NextResponse.json(
      { error: error.message || 'Error al conectar con el backend' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('POST /api/tasks error:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear la tarea' },
      { status: 500 }
    );
  }
}
