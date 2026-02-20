'use client';
// src/components/FilterPanel.tsx

import { FiltrosBusqueda } from '@/lib/airtable';

interface Props {
  filtros: FiltrosBusqueda;
  onChange: (filtros: FiltrosBusqueda) => void;
  especialidades: string[];
  totalResultados: number;
  cargando: boolean;
}

const PREVISIONES = ['Fonasa A', 'Fonasa B', 'Fonasa C', 'Fonasa D', 'Isapre'];
const MODALIDADES = ['Online', 'Presencial'];

export default function FilterPanel({
  filtros,
  onChange,
  especialidades,
  totalResultados,
  cargando,
}: Props) {
  const update = (campo: keyof FiltrosBusqueda, valor: string | number | undefined) => {
    onChange({ ...filtros, [campo]: valor || undefined });
  };

  const limpiar = () => onChange({});

  const hayFiltros = Object.values(filtros).some((v) => v !== undefined);

  return (
    <aside className="filter-panel">
      <div className="filter-header">
        <h2 className="filter-title">Filtros</h2>
        {hayFiltros && (
          <button onClick={limpiar} className="btn-limpiar">
            Limpiar todo
          </button>
        )}
      </div>

      {/* Previsión */}
      <div className="filter-group">
        <label className="filter-label">Previsión</label>
        <select
          className="filter-select"
          value={filtros.prevision || ''}
          onChange={(e) => update('prevision', e.target.value)}
        >
          <option value="">Todas</option>
          {PREVISIONES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Especialidad */}
      <div className="filter-group">
        <label className="filter-label">Especialidad</label>
        <select
          className="filter-select"
          value={filtros.especialidad || ''}
          onChange={(e) => update('especialidad', e.target.value)}
        >
          <option value="">Todas</option>
          {especialidades.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      {/* Modalidad */}
      <div className="filter-group">
        <label className="filter-label">Modalidad</label>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="modalidad"
              value=""
              checked={!filtros.modalidad}
              onChange={() => update('modalidad', undefined)}
            />
            <span>Ambas</span>
          </label>
          {MODALIDADES.map((m) => (
            <label key={m} className="radio-option">
              <input
                type="radio"
                name="modalidad"
                value={m}
                checked={filtros.modalidad === m}
                onChange={() => update('modalidad', m)}
              />
              <span>{m}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Precio */}
      <div className="filter-group">
        <label className="filter-label">
          Precio particular (CLP)
        </label>
        <div className="precio-inputs">
          <div className="precio-input-wrap">
            <span className="peso-sign">$</span>
            <input
              type="number"
              placeholder="Mínimo"
              className="filter-input"
              value={filtros.precioMin || ''}
              onChange={(e) => update('precioMin', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <span className="precio-sep">—</span>
          <div className="precio-input-wrap">
            <span className="peso-sign">$</span>
            <input
              type="number"
              placeholder="Máximo"
              className="filter-input"
              value={filtros.precioMax || ''}
              onChange={(e) => update('precioMax', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>
      </div>

      <div className="filter-resultados">
        {cargando ? (
          <span className="cargando-txt">Buscando…</span>
        ) : (
          <span>
            <strong>{totalResultados}</strong>{' '}
            {totalResultados === 1 ? 'psicólogo encontrado' : 'psicólogos encontrados'}
          </span>
        )}
      </div>
    </aside>
  );
}
