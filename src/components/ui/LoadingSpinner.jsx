export default function LoadingSpinner({ size = 'md' }) {
  const s = size === 'lg' ? 48 : size === 'sm' ? 20 : 32;
  return (
    <div style={{
      width: s, height: s, borderRadius: '50%',
      border: `${s > 30 ? 4 : 3}px solid #e2e8f0`,
      borderTopColor: '#6366f1',
      animation: 'spin .7s linear infinite'
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
