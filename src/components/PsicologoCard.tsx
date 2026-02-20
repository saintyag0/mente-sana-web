'use client';
// src/components/PsicologoCard.tsx

import { Psicologo } from '@/lib/airtable';

interface Props {
  psicologo: Psicologo;
}

export default function PsicologoCard({ psicologo }: Props) {
  const initials = psicologo.nombre
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  return (
    <article className="card">
      <div className="card-top">
        <div className="avatar">
          {psicologo.foto ? (
            <img src={psicologo.foto} alt={psicologo.nombre} />
          ) : (
            <span className="avatar-initials">{initials}</span>
          )}
        </div>

        <div className="card-header-info">
          <h2 className="nombre">{psicologo.nombre}</h2>
          {psicologo.ciudad && <p className="ciudad">📍 {psicologo.ciudad}</p>}
          {psicologo.años_experiencia ? (
            <p className="experiencia">{psicologo.años_experiencia} años de experiencia</p>
          ) : null}
        </div>
      </div>

      {psicologo.descripcion && (
        <p className="descripcion">{psicologo.descripcion}</p>
      )}

      <div className="tags-row">
        {psicologo.especialidad.map((e) => (
          <span key={e} className="tag tag-esp">{e}</span>
        ))}
        {psicologo.modalidad.map((m) => (
          <span key={m} className={`tag tag-mod tag-mod-${m.toLowerCase()}`}>{m}</span>
        ))}
      </div>

      <div className="prevision-row">
        <span className="label-prevision">Previsión:</span>
        {psicologo.prevision.length > 0 ? (
          psicologo.prevision.map((p) => (
            <span key={p} className="tag tag-prev">{p}</span>
          ))
        ) : (
          <span className="sin-datos">No especificada</span>
        )}
      </div>

      <div className="card-footer">
        <div className="precio-wrap">
          <span className="precio-label">Precio particular</span>
          <span className="precio-valor">
            {psicologo.precioParticular > 0
              ? `$${psicologo.precioParticular.toLocaleString('es-CL')}`
              : 'Consultar'}
          </span>
        </div>

        {psicologo.link_agendamiento ? (
          <a
            href={psicologo.link_agendamiento}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-agendar"
          >
            Agendar hora
          </a>
        ) : (
          <button className="btn-agendar btn-disabled" disabled>
            Sin agendamiento
          </button>
        )}
      </div>
    </article>
  );
}
