// src/components/Loading.jsx
import "../styles/loading.css";

// ── Spinner ───────────────────────────────────────────────────────────────────
// Use for single items, forms, or full-page loads
export function Spinner({ text = "Loading..." }) {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" />
      <span className="spinner-text">{text}</span>
    </div>
  );
}

// ── Table skeleton ─────────────────────────────────────────────────────────────
// Use inside <tbody> to mimic table rows while data loads
// colCount should match your table's column count
export function TableSkeleton({ rowCount = 5, colCount = 7 }) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIdx) => (
        <tr key={rowIdx} className="skeleton-row">
          {Array.from({ length: colCount }).map((_, colIdx) => (
            <td key={colIdx}>
              <span
                className={`skeleton skeleton-cell ${
                  // vary widths so it looks more natural
                  colIdx % 3 === 0
                    ? "short"
                    : colIdx % 3 === 1
                      ? "medium"
                      : "long"
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ── Stats card skeleton ────────────────────────────────────────────────────────
// Use while dashboard stat numbers are loading
export function StatsSkeleton({ count = 4 }) {
  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton-card"
          style={{ flex: "1", minWidth: "120px" }}
        >
          <span className="skeleton skeleton-text short" />
          <span
            className="skeleton skeleton-text medium"
            style={{ height: "28px" }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Error state ────────────────────────────────────────────────────────────────
export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="spinner-wrapper">
      <span style={{ fontSize: "24px" }}>⚠️</span>
      <span className="spinner-text">{message || "Something went wrong"}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: "8px",
            padding: "6px 16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            cursor: "pointer",
            background: "white",
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
}
