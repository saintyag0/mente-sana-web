// src/app/api/psicologos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPsicologos, buscarPsicologos, FiltrosBusqueda } from '@/lib/airtable';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filtros: FiltrosBusqueda = {
      precioMin: searchParams.get('precioMin') ? Number(searchParams.get('precioMin')) : undefined,
      precioMax: searchParams.get('precioMax') ? Number(searchParams.get('precioMax')) : undefined,
      prevision: searchParams.get('prevision') || undefined,
      especialidad: searchParams.get('especialidad') || undefined,
      modalidad: searchParams.get('modalidad') || undefined,
    };

    const todos = await getPsicologos();
    const resultado = buscarPsicologos(todos, filtros);

    return NextResponse.json({ psicologos: resultado, total: resultado.length });
  } catch (error) {
    console.error('Error al obtener psicólogos:', error);
    return NextResponse.json(
      { error: 'Error al conectar con Airtable. Revisa tus variables de entorno.' },
      { status: 500 }
    );
  }
}
