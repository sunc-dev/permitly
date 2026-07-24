import React from "react";

// Renders **bold**, bullet lists and paragraphs — mirrors the prototype's fmt().
function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={`${keyBase}-${i}`}>{p.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={`${keyBase}-${i}`}>{p}</React.Fragment>;
  });
}

export function fmt(text: string): React.ReactNode {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let bullets: string[] = [];
  let key = 0;

  const flush = () => {
    if (bullets.length) {
      const items = bullets;
      out.push(
        <ul key={`ul-${key++}`}>
          {items.map((b, i) => (
            <li key={i}>{renderInline(b, `li-${key}-${i}`)}</li>
          ))}
        </ul>
      );
      bullets = [];
    }
  };

  for (const raw of lines) {
    const l = raw.trim();
    if (!l) {
      flush();
      continue;
    }
    if (l.startsWith("- ") || l.startsWith("• ")) {
      bullets.push(l.substring(2));
    } else {
      flush();
      out.push(<p key={`p-${key++}`}>{renderInline(l, `p-${key}`)}</p>);
    }
  }
  flush();
  return <>{out}</>;
}
