export function TechList({ tech }: { tech: string[] }) {
  if (tech.length === 0) return null;
  return <ul className="tech-list" aria-label="Teknologi">{tech.map((item) => <li key={item}>{item}</li>)}</ul>;
}
