import { useState } from 'react';

/**
 * Modern UI Component Library
 * Latest design trends: Glass morphism, Gradients, Micro-interactions
 */

export const ModernButton = ({ label, variant = 'primary', size = 'md', icon, onClick, disabled = false }) => {
  const variants = {
    primary: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#fff",
      hover: "linear-gradient(135deg, #5568d3 0%, #6b3f8f 100%)"
    },
    secondary: {
      background: "rgba(102, 126, 234, 0.1)",
      color: "#667eea",
      border: "1px solid rgba(102, 126, 234, 0.3)"
    },
    glass: {
      background: "rgba(255, 255, 255, 0.1)",
      color: "#fff",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)"
    }
  };

  const sizes = { sm: { padding: "8px 16px" }, md: { padding: "12px 24px" }, lg: { padding: "16px 32px" } };
  const style = variants[variant];
  const sizeStyle = sizes[size];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...sizeStyle,
        background: style.background,
        color: style.color,
        border: style.border || "none",
        borderRadius: "12px",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: disabled ? 0.5 : 1,
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
};

export const ModernCard = ({ title, children, variant = 'default', icon }) => {
  const variants = {
    default: { bg: "#ffffff", border: "1px solid #e5e7eb", color: "#111827" },
    glass: { bg: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)", color: "#fff" },
    dark: { bg: "#1f2937", border: "1px solid #374151", color: "#f3f4f6" }
  };

  const style = variants[variant];

  return (
    <div style={{
      background: style.bg,
      border: style.border,
      borderRadius: "16px",
      padding: "24px",
      color: style.color,
      boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
      transition: "all 300ms"
    }}>
      {title && (
        <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600 }}>
          {icon && <span style={{ marginRight: "8px" }}>{icon}</span>}
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export const ModernBadge = ({ label, variant = 'primary', icon }) => {
  const variants = {
    primary: { bg: "rgba(102, 126, 234, 0.1)", text: "#667eea" },
    success: { bg: "rgba(16, 185, 129, 0.1)", text: "#10b981" },
    warning: { bg: "rgba(245, 158, 11, 0.1)", text: "#f59e0b" }
  };

  const style = variants[variant];

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 12px",
      backgroundColor: style.bg,
      color: style.text,
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: 600
    }}>
      {icon && <span>{icon}</span>}
      {label}
    </span>
  );
};

export const ModernProgressBar = ({ value = 65, label, variant = 'primary' }) => {
  const variants = {
    primary: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
    success: "linear-gradient(90deg, #11998e 0%, #38ef7d 100%)",
    warning: "linear-gradient(90deg, #f093fb 0%, #f5576c 100%)"
  };

  return (
    <div>
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      )}
      <div style={{
        width: "100%",
        height: "8px",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        borderRadius: "4px",
        overflow: "hidden"
      }}>
        <div style={{
          width: `${value}%`,
          height: "100%",
          background: variants[variant],
          transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
        }} />
      </div>
    </div>
  );
};

export const ModernInput = ({ placeholder, icon, variant = 'default', value, onChange }) => {
  const [focused, setFocused] = useState(false);

  const variants = {
    default: { bg: "#ffffff", border: "1px solid #e5e7eb", focus: "#667eea" },
    glass: { bg: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", focus: "#667eea" },
    dark: { bg: "#1f2937", border: "1px solid #374151", focus: "#667eea" }
  };

  const style = variants[variant];

  return (
    <div style={{ position: "relative" }}>
      {icon && <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>{icon}</span>}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          paddingLeft: icon ? "40px" : "16px",
          paddingRight: "16px",
          paddingTop: "12px",
          paddingBottom: "12px",
          backgroundColor: style.bg,
          border: focused ? `2px solid ${style.focus}` : style.border,
          borderRadius: "12px",
          fontSize: "14px",
          outline: "none",
          transition: "all 200ms"
        }}
      />
    </div>
  );
};

export default { ModernButton, ModernCard, ModernBadge, ModernProgressBar, ModernInput };
