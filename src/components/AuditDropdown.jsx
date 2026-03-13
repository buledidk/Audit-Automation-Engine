import React, { useState, useEffect, useMemo, useRef } from "react";

/**
 * AuditDropdown Component - Advanced dropdown with search, filter, and custom options
 * Supports multi-select, custom options, hierarchical data, and real-time filtering
 */
export function AuditDropdown({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Search or select...",
  searchable = true,
  filterable = false,
  filters = {},
  onFilterChange,
  multi = false,
  customizable = false,
  onAddCustom,
  maxHeight = "300px",
  minWidth = "200px",
  groupBy = null,
  showDescription = false,
  highlightStyle = "bg",
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on search term and filters
  const filteredOptions = useMemo(() => {
    let result = options;

    // Apply filter criteria
    if (filters && Object.keys(filters).length > 0) {
      result = result.filter(opt => {
        return Object.entries(filters).every(([key, filterValue]) => {
          if (!filterValue) return true; // Skip empty filters
          const optValue = opt[key];
          if (Array.isArray(filterValue)) {
            return filterValue.includes(optValue);
          }
          return optValue === filterValue;
        });
      });
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(opt => {
        const searchFields = [opt.name, opt.label, opt.description, opt.code].filter(Boolean);
        return searchFields.some(field => field.toLowerCase().includes(term));
      });
    }

    return result;
  }, [options, searchTerm, filters]);

  // Group options if groupBy specified
  const groupedOptions = useMemo(() => {
    if (!groupBy) return { "": filteredOptions };

    const groups = {};
    filteredOptions.forEach(opt => {
      const groupKey = opt[groupBy] || "Other";
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(opt);
    });
    return groups;
  }, [filteredOptions, groupBy]);

  const handleSelect = (option) => {
    if (multi) {
      const newValue = Array.isArray(value) ? value : [];
      const isSelected = newValue.some(v => v.id === option.id);
      onChange(
        isSelected
          ? newValue.filter(v => v.id !== option.id)
          : [...newValue, option]
      );
    } else {
      onChange(option);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleAddCustom = () => {
    if (customInput.trim()) {
      const newOption = {
        id: `custom_${Date.now()}`,
        name: customInput.trim(),
        custom: true
      };
      onAddCustom?.(newOption);
      setCustomInput("");
      setShowCustom(false);
      if (!multi) {
        handleSelect(newOption);
      }
    }
  };

  const displayValue = () => {
    if (!value) return placeholder;
    if (multi && Array.isArray(value)) {
      return value.length === 0
        ? placeholder
        : `${value.length} selected`;
    }
    return value.name || value.label || value;
  };

  const COLORS = {
    bg: "#0A0E17",
    border: "rgba(255,255,255,0.08)",
    text: "#F8F8F8",
    dim: "rgba(255,255,255,0.6)",
    accent: "#F5A623",
    card: "rgba(255,255,255,0.04)",
    hover: "rgba(245,166,35,0.15)",
    selected: "rgba(245,166,35,0.25)"
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        minWidth,
        marginBottom: "12px"
      }}
    >
      {label && (
        <label style={{
          display: "block",
          color: COLORS.accent,
          fontSize: "10px",
          fontWeight: 700,
          marginBottom: "6px",
          textTransform: "uppercase"
        }}>
          {label}
        </label>
      )}

      {/* Dropdown trigger button */}
      <button
        ref={inputRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "10px 12px",
          background: disabled ? COLORS.card : COLORS.bg,
          border: `1px solid ${isOpen ? COLORS.accent : COLORS.border}`,
          borderRadius: "6px",
          color: COLORS.text,
          fontSize: "12px",
          textAlign: "left",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.2s",
          opacity: disabled ? 0.6 : 1
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {displayValue()}
        </span>
        <span style={{ marginLeft: "8px", color: COLORS.dim }}>
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "6px",
            marginTop: "4px",
            maxHeight,
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}
        >
          {/* Search box */}
          {searchable && (
            <div style={{ padding: "8px", borderBottom: `1px solid ${COLORS.border}` }}>
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "4px",
                  color: COLORS.text,
                  fontSize: "12px",
                  boxSizing: "border-box"
                }}
              />
            </div>
          )}

          {/* Options */}
          {Object.entries(groupedOptions).map(([groupName, items]) => (
            <div key={groupName}>
              {groupName && (
                <div style={{
                  padding: "8px 12px",
                  color: COLORS.dim,
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  background: COLORS.bg,
                  borderBottom: `1px solid ${COLORS.border}`
                }}>
                  {groupName}
                </div>
              )}
              {items.map((option) => {
                const isSelected = multi
                  ? Array.isArray(value) && value.some(v => v.id === option.id)
                  : value?.id === option.id;

                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelect(option)}
                    style={{
                      padding: "10px 12px",
                      cursor: "pointer",
                      background: isSelected ? COLORS.selected : "transparent",
                      borderBottom: `1px solid ${COLORS.border}`,
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = COLORS.hover;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isSelected ? COLORS.selected : "transparent";
                    }}
                  >
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      <div>
                        <div style={{
                          color: isSelected ? COLORS.accent : COLORS.text,
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: "12px"
                        }}>
                          {multi && (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              style={{ marginRight: "8px" }}
                            />
                          )}
                          {option.name || option.label}
                          {option.code && (
                            <span style={{ color: COLORS.dim, marginLeft: "8px", fontSize: "10px" }}>
                              ({option.code})
                            </span>
                          )}
                        </div>
                        {showDescription && option.description && (
                          <div style={{
                            color: COLORS.dim,
                            fontSize: "10px",
                            marginTop: "2px",
                            lineHeight: 1.3
                          }}>
                            {option.description.substring(0, 50)}...
                          </div>
                        )}
                      </div>
                      {option.riskLevel && (
                        <div style={{
                          padding: "2px 6px",
                          borderRadius: "3px",
                          background: option.riskLevel === "High"
                            ? "rgba(239,83,80,0.2)"
                            : option.riskLevel === "Medium"
                              ? "rgba(255,167,38,0.2)"
                              : "rgba(102,187,106,0.2)",
                          color: option.riskLevel === "High"
                            ? "#EF5350"
                            : option.riskLevel === "Medium"
                              ? "#FFA726"
                              : "#66BB6A",
                          fontSize: "9px",
                          fontWeight: 600
                        }}>
                          {option.riskLevel}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* No results message */}
          {Object.values(groupedOptions).every(group => group.length === 0) && (
            <div style={{
              padding: "12px",
              textAlign: "center",
              color: COLORS.dim,
              fontSize: "12px"
            }}>
              No options found
            </div>
          )}

          {/* Custom option input */}
          {customizable && (
            <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: "8px" }}>
              {!showCustom ? (
                <button
                  onClick={() => setShowCustom(true)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: "transparent",
                    border: `1px dashed ${COLORS.border}`,
                    borderRadius: "4px",
                    color: COLORS.dim,
                    fontSize: "11px",
                    cursor: "pointer",
                    fontWeight: 500
                  }}
                >
                  + Add Custom Option
                </button>
              ) : (
                <div style={{ display: "flex", gap: "4px" }}>
                  <input
                    autoFocus
                    type="text"
                    placeholder="New option"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddCustom();
                      if (e.key === "Escape") setShowCustom(false);
                    }}
                    style={{
                      flex: 1,
                      padding: "6px",
                      background: COLORS.bg,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: "4px",
                      color: COLORS.text,
                      fontSize: "11px",
                      boxSizing: "border-box"
                    }}
                  />
                  <button
                    onClick={handleAddCustom}
                    style={{
                      padding: "6px 10px",
                      background: COLORS.accent,
                      border: "none",
                      borderRadius: "4px",
                      color: "#000",
                      fontSize: "10px",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * FilterBar Component - Complementary filter controls for dropdowns
 */
export function FilterBar({ filters, onFilterChange, filterOptions = {} }) {
  const COLORS = {
    bg: "#0A0E17",
    border: "rgba(255,255,255,0.08)",
    text: "#F8F8F8",
    dim: "rgba(255,255,255,0.6)",
    accent: "#F5A623",
    card: "rgba(255,255,255,0.04)"
  };

  return (
    <div style={{
      display: "flex",
      gap: "12px",
      padding: "12px",
      background: COLORS.card,
      borderRadius: "8px",
      border: `1px solid ${COLORS.border}`,
      marginBottom: "16px",
      flexWrap: "wrap",
      alignItems: "center"
    }}>
      <span style={{ color: COLORS.dim, fontSize: "11px", fontWeight: 700 }}>FILTERS:</span>
      {Object.entries(filterOptions).map(([key, options]) => (
        <select
          key={key}
          value={filters[key] || ""}
          onChange={(e) => onFilterChange({ ...filters, [key]: e.target.value || null })}
          style={{
            padding: "6px 10px",
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "4px",
            color: COLORS.text,
            fontSize: "11px",
            cursor: "pointer"
          }}
        >
          <option value="">All {key}</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ))}
    </div>
  );
}
