'use client';
// src/app/page.tsx

import { useEffect, useState, useCallback } from 'react';
import FilterPanel from '@/components/FilterPanel';
import PsicologoCard from '@/components/PsicologoCard';
import { Psicologo, FiltrosBusqueda } from '@/lib/airtable';

export default function Home() {
  const [psicologos, setPsicologos] = useState<Psicologo[]>([]);
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [filtros, setFiltros] = useState<FiltrosBusqueda>({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarPsicologos = useCallback(async (f: FiltrosBusqueda) => {
    setCargando(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (f.prevision) params.set('prevision', f.prevision);
      if (f.especialidad) params.set('especialidad', f.especialidad);
      if (f.modalidad) params.set('modalidad', f.modalidad);
      if (f.precioMin) params.set('precioMin', String(f.precioMin));
      if (f.precioMax) params.set('precioMax', String(f.precioMax));

      const res = await fetch(`/api/psicologos?${params.toString()}`);
      if (!res.ok) throw new Error('Error al obtener datos');
      const data = await res.json();
      setPsicologos(data.psicologos);
    } catch {
      setError('No se pudo conectar con la base de datos. Revisa la configuración de Airtable.');
    } finally {
      setCargando(false);
    }
  }, []);

  // Carga inicial: todos sin filtro para extraer especialidades
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch('/api/psicologos');
        const data = await res.json();
        const esp = [...new Set((data.psicologos as Psicologo[]).flatMap((p) => p.especialidad))].sort();
        setEspecialidades(esp as string[]);
        setPsicologos(data.psicologos);
      } catch {
        setError('No se pudo conectar con la base de datos.');
      } finally {
        setCargando(false);
      }
    };
    init();
  }, []);

  // Re-busca cada vez que cambian los filtros (con debounce de precio)
  useEffect(() => {
    const timer = setTimeout(() => cargarPsicologos(filtros), 300);
    return () => clearTimeout(timer);
  }, [filtros, cargarPsicologos]);

  return (
    <div className="app">
      {/* Header */}
      <header className="site-header">
        <div className="header-inner">
          <div className="logo-wrap">
            <span className="logo-icon">🧠</span>
            <div>
              <h1 className="site-title">MenteSana</h1>
              <p className="site-subtitle">Directorio de psicólogos en Chile</p>
            </div>
          </div>
          <p className="header-desc">
            Encuentra al profesional de salud mental que se adapta a tu previsión, ubicación y necesidades.
          </p>
        </div>
      </header>

      {/* Layout principal */}
      <main className="main-layout">
        <FilterPanel
          filtros={filtros}
          onChange={setFiltros}
          especialidades={especialidades}
          totalResultados={psicologos.length}
          cargando={cargando}
        />

        <section className="resultados">
          {error && (
            <div className="error-banner">
              <span>⚠️</span>
              <div>
                <strong>Error de conexión</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {cargando && !error && (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          )}

          {!cargando && !error && psicologos.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <h3>Sin resultados</h3>
              <p>Intenta con filtros más amplios para encontrar psicólogos disponibles.</p>
            </div>
          )}

          {!cargando && !error && psicologos.length > 0 && (
            <div className="cards-grid">
              {psicologos.map((p) => (
                <PsicologoCard key={p.id} psicologo={p} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <p>MenteSana · Directorio de Psicólogos en Chile · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
