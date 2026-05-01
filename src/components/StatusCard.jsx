/**
 * StatusCard.jsx - Phase 8 Day 2
 * Reusable status card component for mobile dashboard
 * Displays metric with icon, value, optional total and subtitle
 */

const COLORS = {
  card: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
  text: '#F8F8F8'
};

export default function StatusCard({ title, value, total, subtitle, color, icon }) {
  return (
    <div style={{
      backgroundColor: COLORS.card,
      border: '1px solid ' + COLORS.border,
      borderRadius: '10px',
      padding: '14px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Color accent bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        backgroundColor: color || '#F5A623'
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{
            margin: '0 0 6px 0',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {title}
          </p>
          <p style={{
            margin: 0,
            fontSize: '22px',
            fontWeight: 700,
            color: color || COLORS.text,
            lineHeight: 1
          }}>
            {value}
            {total !== undefined && (
              <span style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>
                /{total}
              </span>
            )}
          </p>
          {subtitle && (
            <p style={{
              margin: '4px 0 0 0',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.4)'
            }}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <span style={{ fontSize: '24px', opacity: 0.8 }}>{icon}</span>
        )}
      </div>

      {/* Progress bar if total is provided */}
      {total !== undefined && typeof value === 'number' && (
        <div style={{
          marginTop: '10px',
          width: '100%',
          height: '4px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: Math.min(100, (value / total) * 100) + '%',
            backgroundColor: color || '#F5A623',
            borderRadius: '2px',
            transition: 'width 0.5s ease'
          }} />
        </div>
      )}
    </div>
  );
}
