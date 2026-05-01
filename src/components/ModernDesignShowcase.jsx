import { useState } from 'react';

/**
 * Modern Design Showcase
 * Demonstrates latest UI/UX trends and patterns
 */
const ModernDesignShowcase = () => {
  const [_searchValue, _setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('components');

  const modernTheme = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    card: {
      light: "#ffffff",
      glass: "rgba(255, 255, 255, 0.1)",
      dark: "#1f2937"
    },
    text: {
      primary: "#111827",
      secondary: "#6b7280",
      light: "#ffffff"
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      padding: "48px 24px",
      fontFamily: "'Inter', '-apple-system', 'BlinkMacSystemFont', sans-serif"
    }}>
      {/* Header */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", marginBottom: "48px" }}>
        <div style={{ 
          background: modernTheme.background, 
          color: "#fff",
          borderRadius: "20px",
          padding: "48px",
          textAlign: "center",
          boxShadow: "0 20px 25px rgba(0, 0, 0, 0.1)"
        }}>
          <h1 style={{ margin: "0 0 12px 0", fontSize: "48px", fontWeight: 700 }}>
            🎨 Modern Audit UI/UX Design System
          </h1>
          <p style={{ margin: 0, fontSize: "18px", opacity: 0.9 }}>
            Latest design trends: Glass morphism, Gradients, Micro-interactions, Smooth Animations
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", marginBottom: "32px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px"
        }}>
          {['components', 'patterns', 'colors', 'animations'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 24px",
                backgroundColor: activeTab === tab ? "#667eea" : "#ffffff",
                color: activeTab === tab ? "#fff" : "#667eea",
                border: `2px solid ${activeTab === tab ? "#667eea" : "#e5e7eb"}`,
                borderRadius: "12px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 200ms",
                textTransform: "capitalize"
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Components Tab */}
      {activeTab === 'components' && (
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Buttons */}
          <ModernCard title="🔘 Buttons" icon="✨" variant="default">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
              <ModernButton label="Primary" variant="primary" icon="✅" />
              <ModernButton label="Secondary" variant="secondary" icon="ℹ️" />
              <ModernButton label="Glass" variant="glass" icon="🔍" />
              <ModernButton label="Disabled" variant="primary" disabled />
            </div>
          </ModernCard>

          {/* Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginTop: "24px" }}>
            <ModernCard title="Default Card" icon="📋" variant="default">
              <p>Modern card with light background and subtle border</p>
            </ModernCard>

            <ModernCard title="Glass Card" icon="🔮" variant="glass">
              <p style={{ color: "#fff" }}>Trendy glass morphism effect with blur</p>
            </ModernCard>

            <ModernCard title="Dark Card" icon="🌙" variant="dark">
              <p>Professional dark mode for modern interfaces</p>
            </ModernCard>
          </div>

          {/* Badges */}
          <ModernCard title="🏷️ Badges" icon="✨" variant="default" style={{ marginTop: "24px" }}>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <ModernBadge label="Primary" variant="primary" icon="●" />
              <ModernBadge label="Success" variant="success" icon="✓" />
              <ModernBadge label="Warning" variant="warning" icon="⚠" />
              <ModernBadge label="New Feature" variant="primary" icon="✨" />
            </div>
          </ModernCard>

          {/* Progress Bars */}
          <ModernCard title="📊 Progress Indicators" icon="✨" variant="default" style={{ marginTop: "24px" }}>
            <div style={{ display: "grid", gap: "24px" }}>
              <ModernProgressBar label="Planning Phase" value={100} variant="primary" />
              <ModernProgressBar label="Testing Phase" value={75} variant="success" />
              <ModernProgressBar label="Final Review" value={45} variant="warning" />
            </div>
          </ModernCard>

          {/* Input Fields */}
          <ModernCard title="📝 Input Fields" icon="✨" variant="default" style={{ marginTop: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              <ModernInput placeholder="Default input" icon="🔍" variant="default" />
              <ModernInput placeholder="Glass input" icon="✨" variant="glass" />
              <ModernInput placeholder="Dark input" icon="🌙" variant="dark" />
            </div>
          </ModernCard>
        </div>
      )}

      {/* Patterns Tab */}
      {activeTab === 'patterns' && (
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <ModernCard title="🎯 Modern Design Patterns" icon="✨" variant="default">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
              <div>
                <h4 style={{ margin: "0 0 12px 0" }}>🔮 Glass Morphism</h4>
                <p>Frosted glass effect with backdrop blur and transparency</p>
              </div>
              <div>
                <h4 style={{ margin: "0 0 12px 0" }}>🌈 Gradients</h4>
                <p>Modern gradient backgrounds with vibrant color combinations</p>
              </div>
              <div>
                <h4 style={{ margin: "0 0 12px 0" }}>✨ Micro-interactions</h4>
                <p>Smooth hover effects, transitions, and loading animations</p>
              </div>
              <div>
                <h4 style={{ margin: "0 0 12px 0" }}>🎨 Dark Mode</h4>
                <p>Beautiful dark theme for comfortable viewing in low light</p>
              </div>
            </div>
          </ModernCard>
        </div>
      )}

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <ModernCard title="🎨 Color Palette" icon="✨" variant="default">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
              {[
                { name: 'Primary', color: '#667eea' },
                { name: 'Success', color: '#10b981' },
                { name: 'Warning', color: '#f59e0b' },
                { name: 'Danger', color: '#ef4444' },
                { name: 'Info', color: '#3b82f6' }
              ].map(color => (
                <div key={color.name} style={{ textAlign: "center" }}>
                  <div style={{
                    width: "100%",
                    height: "80px",
                    backgroundColor: color.color,
                    borderRadius: "12px",
                    marginBottom: "12px",
                    boxShadow: `0 4px 12px ${color.color}40`
                  }} />
                  <strong>{color.name}</strong><br />
                  <code style={{ fontSize: "11px", color: "#6b7280" }}>{color.color}</code>
                </div>
              ))}
            </div>
          </ModernCard>
        </div>
      )}

      {/* Animations Tab */}
      {activeTab === 'animations' && (
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <ModernCard title="✨ Animation Examples" icon="✨" variant="default">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {[
                { name: '⬆️ Hover Lift', delay: '0s' },
                { name: '🌀 Spin', delay: '0.1s' },
                { name: '💫 Fade In', delay: '0.2s' }
              ].map((anim, idx) => (
                <div key={idx} style={{
                  padding: "24px",
                  backgroundColor: "#f0f4ff",
                  borderRadius: "12px",
                  textAlign: "center",
                  animation: `fadeIn 0.6s ease-out ${anim.delay}`,
                  border: "2px solid #667eea"
                }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>{anim.name}</div>
                  <p style={{ margin: 0, color: "#667eea", fontWeight: 600 }}>Smooth animation</p>
                </div>
              ))}
            </div>
          </ModernCard>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default ModernDesignShowcase;
