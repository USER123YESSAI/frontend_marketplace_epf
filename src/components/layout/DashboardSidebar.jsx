import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { messageService } from '../../services/messageService';

export default function DashboardSidebar({ title, subtitle, accentColor = '#6366f1', navItems }) {
  const { user, logout } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const fetch = () => {
      messageService.getUnreadCount()
        .then(({ data }) => setUnread(data.count ?? data.unread_count ?? 0))
        .catch(() => {});
    };
    fetch();
    const id = setInterval(fetch, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="dashboard-sidebar" style={{
        width: 240, flexShrink: 0, position: 'sticky', top: 24,
        background: 'white', borderRadius: 16,
        boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 48px)'
      }}>
        {/* Header sidebar */}
        <div style={{ padding: '18px 16px', borderBottom: '1px solid var(--border)', background: `linear-gradient(135deg, ${accentColor}10, ${accentColor}05)` }}>
          <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {subtitle}
          </p>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{title}</h2>
        </div>

        {/* Nav links */}
        <nav style={{ padding: '8px 8px', flex: 1, overflowY: 'auto' }}>
          {navItems.map((item) => (
            <SidebarLink key={item.to} item={item} accentColor={accentColor} unread={item.label === 'Messages' ? unread : 0} />
          ))}
        </nav>

        {/* User footer */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', background: '#fafafa' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 99, flexShrink: 0,
              background: `linear-gradient(135deg, ${accentColor}, #8b5cf6)`,
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 13
            }}>
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </p>
            </div>
          </div>
          <button onClick={logout} style={{
            width: '100%', padding: '7px 12px', borderRadius: 8,
            fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'white',
            color: '#64748b', fontFamily: 'inherit', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 6, transition: 'all .15s', border: 'none'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#fca5a5'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Mobile nav ── */}
      <nav className="dashboard-mobile-nav" style={{
        display: 'none', gap: 6, overflowX: 'auto', paddingBottom: 4,
        marginBottom: 8, WebkitOverflowScrolling: 'touch',
      }}>
        {navItems.map((item) => (
          <SidebarLink key={item.to} item={item} accentColor={accentColor} mobile unread={item.label === 'Messages' ? unread : 0} />
        ))}
      </nav>
    </>
  );
}

function SidebarLink({ item, accentColor, mobile, unread = 0 }) {
  const baseStyle = mobile
    ? {
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '7px 14px', borderRadius: 99, fontSize: 13, fontWeight: 600,
        textDecoration: 'none', whiteSpace: 'nowrap',
        border: '1.5px solid var(--border)', transition: 'all .15s', flexShrink: 0,
      }
    : {
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', borderRadius: 10, fontSize: 14, fontWeight: 600,
        textDecoration: 'none', marginBottom: 2, transition: 'all .15s',
      };

  return (
    <NavLink
      to={item.to}
      end={item.end}
      style={({ isActive }) => ({
        ...baseStyle,
        color: isActive ? accentColor : '#475569',
        background: isActive ? accentColor + '12' : 'transparent',
        ...(mobile ? { borderColor: isActive ? accentColor + '40' : 'var(--border)' } : {}),
      })}
    >
      {item.icon && (
        <span style={{ fontSize: mobile ? 14 : 18, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
      )}
      <span style={{ flex: 1 }}>{item.label}</span>
      {/* Badge non lus */}
      {unread > 0 && (
        <span style={{
          minWidth: 18, height: 18, borderRadius: 99, padding: '0 4px',
          background: '#ef4444', color: 'white', fontSize: 10, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </NavLink>
  );
}
