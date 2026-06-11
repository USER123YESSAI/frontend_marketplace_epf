const MAP = {
  pending:   { label: 'En attente', color: '#f59e0b', bg: '#fffbeb' },
  confirmed: { label: 'Confirmée',  color: '#3b82f6', bg: '#eff6ff' },
  processing: { label: 'En cours', color: '#6366f1', bg: '#eef2ff' },
  shipped:   { label: 'Expédiée',   color: '#8b5cf6', bg: '#f5f3ff' },
  delivered: { label: 'Livrée',     color: '#10b981', bg: '#f0fdf4' },
  cancelled: { label: 'Annulée',    color: '#ef4444', bg: '#fef2f2' },
  published: { label: 'Publié',     color: '#10b981', bg: '#f0fdf4' },
  draft:     { label: 'Brouillon',  color: '#64748b', bg: '#f8fafc' },
  sold:      { label: 'Vendu',      color: '#6366f1', bg: '#eef2ff' },
  inactive:  { label: 'Inactif',    color: '#94a3b8', bg: '#f8fafc' },
  active:    { label: 'Actif',      color: '#10b981', bg: '#f0fdf4' },
  suspended: { label: 'Suspendu',   color: '#ef4444', bg: '#fef2f2' },
};

export default function StatusBadge({ status }) {
  const s = MAP[status] ?? { label: status, color: '#64748b', bg: '#f8fafc' };
  return (
    <span
      style={{
        padding: '3px 10px',
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 700,
        color: s.color,
        background: s.bg,
        display: 'inline-block',
      }}
    >
      {s.label}
    </span>
  );
}

