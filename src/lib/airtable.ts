// src/lib/airtable.ts
// Conexión y tipos para Airtable

export interface Psicologo {
  id: string;
  nombre: string;
  especialidad: string[];
  prevision: string[];          // ['Fonasa A', 'Fonasa B', 'Fonasa C', 'Fonasa D', 'Isapre']
  modalidad: string[];          // ['Online', 'Presencial']
  precioParticular: number;
  descripcion: string;
  foto?: string;
  link_agendamiento?: string;
  años_experiencia?: number;
  ciudad?: string;
}

export interface FiltrosBusqueda {
  precioMin?: number;
  precioMax?: number;
  prevision?: string;
  especialidad?: string;
  modalidad?: string;
}

// Obtiene todos los psicólogos desde Airtable
export async function getPsicologos(): Promise<Psicologo[]> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || 'Psicólogos';

  if (!apiKey || !baseId) {
    throw new Error('Faltan las variables de entorno de Airtable');
  }

  const encodedTable = encodeURIComponent(tableName);
  const url = `https://api.airtable.com/v0/${baseId}/${encodedTable}?view=Grid%20view`;

  const allRecords: Psicologo[] = [];
  let offset: string | undefined;

  // Airtable pagina de 100 en 100, usamos un loop para traer todos
  do {
    const fetchUrl = offset ? `${url}&offset=${offset}` : url;
    const res = await fetch(fetchUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 60 }, // Cache de 60 segundos en Next.js
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Error Airtable: ${res.status} - ${err}`);
    }

    const data = await res.json();
    offset = data.offset;

    for (const record of data.records) {
      const f = record.fields;
      allRecords.push({
        id: record.id,
        nombre: f['Nombre'] || 'Sin nombre',
        especialidad: Array.isArray(f['Especialidad']) ? f['Especialidad'] : f['Especialidad'] ? [f['Especialidad']] : [],
        prevision: Array.isArray(f['Previsión']) ? f['Previsión'] : f['Previsión'] ? [f['Previsión']] : [],
        modalidad: Array.isArray(f['Modalidad']) ? f['Modalidad'] : f['Modalidad'] ? [f['Modalidad']] : [],
        precioParticular: f['Precio Particular'] || 0,
        descripcion: f['Descripción'] || '',
        foto: f['Foto'] ? f['Foto'][0]?.url : undefined,
        link_agendamiento: f['Link Agendamiento'] || '',
        años_experiencia: f['Años de Experiencia'] || 0,
        ciudad: f['Ciudad'] || '',
      });
    }
  } while (offset);

  return allRecords;
}

// Calcula un score de match (0-100) para ordenar por relevancia
export function calcularScore(psicologo: Psicologo, filtros: FiltrosBusqueda): number {
  let score = 0;

  // Match de previsión: más importante (40 pts)
  if (filtros.prevision) {
    if (psicologo.prevision.includes(filtros.prevision)) score += 40;
  } else {
    score += 40; // Sin filtro = todos puntúan igual
  }

  // Match de especialidad (30 pts)
  if (filtros.especialidad) {
    if (psicologo.especialidad.includes(filtros.especialidad)) score += 30;
  } else {
    score += 30;
  }

  // Match de modalidad (20 pts)
  if (filtros.modalidad) {
    if (psicologo.modalidad.includes(filtros.modalidad)) score += 20;
  } else {
    score += 20;
  }

  // Match de precio (10 pts)
  const precio = psicologo.precioParticular;
  const dentroRango =
    (!filtros.precioMin || precio >= filtros.precioMin) &&
    (!filtros.precioMax || precio <= filtros.precioMax);
  if (dentroRango) score += 10;

  return score;
}

// Filtra y ordena psicólogos según los filtros del usuario
export function buscarPsicologos(psicologos: Psicologo[], filtros: FiltrosBusqueda): Psicologo[] {
  // 1. Filtrado estricto
  let resultado = psicologos.filter((p) => {
    // Precio
    if (filtros.precioMin && p.precioParticular < filtros.precioMin) return false;
    if (filtros.precioMax && p.precioParticular > filtros.precioMax) return false;
    // Previsión
    if (filtros.prevision && !p.prevision.includes(filtros.prevision)) return false;
    // Especialidad
    if (filtros.especialidad && !p.especialidad.includes(filtros.especialidad)) return false;
    // Modalidad
    if (filtros.modalidad && !p.modalidad.includes(filtros.modalidad)) return false;
    return true;
  });

  // 2. Ordenar por score descendente
  resultado.sort((a, b) => calcularScore(b, filtros) - calcularScore(a, filtros));

  return resultado;
}

// Listas únicas para los selectores de filtro
export function getOpcionesUnicas(psicologos: Psicologo[]) {
  const especialidades = [...new Set(psicologos.flatMap((p) => p.especialidad))].sort();
  const prevision = ['Fonasa A', 'Fonasa B', 'Fonasa C', 'Fonasa D', 'Isapre'];
  const modalidad = ['Online', 'Presencial'];
  return { especialidades, prevision, modalidad };
}
