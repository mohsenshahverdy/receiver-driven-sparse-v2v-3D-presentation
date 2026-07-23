function CardShell({ visual, children }) {
  if (!visual) return null;
  const variant = visual.variant ? ` evidence-variant-${visual.variant}` : '';
  return <section className={`evidence evidence-type-${visual.type}${variant}`} key={visual.title}>
    <div className="evidence-topline">
      {visual.kicker && <span>{visual.kicker}</span>}
      <strong>{visual.title}</strong>
    </div>
    {children}
  </section>;
}

function FigureVisual({ visual }) {
  return <CardShell visual={visual}>
    <div className="evidence-figure">
      <img src={visual.image} alt={visual.title} />
    </div>
    {visual.caption && <p className="evidence-caption">{visual.caption}</p>}
  </CardShell>;
}

function FigureBulletsVisual({ visual }) {
  return <CardShell visual={visual}>
    <div className="evidence-figure-bullets">
      <figure className="evidence-figure">
        <img src={visual.image} alt={visual.title} />
      </figure>
      <ul className="evidence-bullets compact">
        {visual.bullets.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
    {visual.caption && <p className="evidence-caption">{visual.caption}</p>}
  </CardShell>;
}

function SplitFiguresVisual({ visual }) {
  return <CardShell visual={visual}>
    <div className="evidence-split">
      {visual.figures.map(figure => <figure key={figure.image}>
        <img src={figure.image} alt={figure.caption} />
        <figcaption>{figure.caption}</figcaption>
      </figure>)}
    </div>
  </CardShell>;
}

function MetricsVisual({ visual }) {
  return <CardShell visual={visual}>
    <div className="metric-grid">
      {visual.metrics.map(metric => <article key={`${metric.value}-${metric.label}`}>
        <b>{metric.value}</b>
        <span>{metric.label}</span>
      </article>)}
    </div>
    {visual.details && <div className="metric-details">
      {visual.details.map(item => <article key={item.title}>
        <b>{item.title}</b>
        <p>{item.text}</p>
      </article>)}
    </div>}
  </CardShell>;
}

function BulletsVisual({ visual }) {
  return <CardShell visual={visual}>
    <ul className="evidence-bullets">
      {visual.bullets.map(item => <li key={item}>{item}</li>)}
    </ul>
    {visual.caption && <p className="evidence-caption">{visual.caption}</p>}
  </CardShell>;
}

function FormulaVisual({ visual }) {
  return <CardShell visual={visual}>
    <div className="formula-card">{visual.formula}</div>
    <ul className="evidence-bullets compact">
      {visual.bullets.map(item => <li key={item}>{item}</li>)}
    </ul>
  </CardShell>;
}

function ResultVisual({ visual }) {
  const [header, ...rows] = visual.rows;
  return <CardShell visual={visual}>
    <table className="result-table">
      <thead><tr>{header.map(cell => <th key={cell}>{cell}</th>)}</tr></thead>
      <tbody>{rows.map(row => <tr key={row.join(':')}>{row.map((cell, i) => <td key={`${row[0]}-${i}`} className={i === 0 ? 'method' : ''}>{cell}</td>)}</tr>)}</tbody>
    </table>
    {visual.caption && <p className="evidence-caption result-caption">{visual.caption}</p>}
  </CardShell>;
}

function MethodCardVisual({ visual }) {
  return <section className="method-detail-card" key={visual.title}>
    <div className="method-detail-topline">
      {visual.kicker && <span>{visual.kicker}</span>}
      <strong>{visual.title}</strong>
    </div>
    <ul>
      {visual.items.map(item => <li key={item}>{item}</li>)}
    </ul>
    {visual.note && <p>{visual.note}</p>}
  </section>;
}

export function EvidenceOverlay({ visual }) {
  if (!visual) return null;
  switch (visual.type) {
    case 'figure': return <FigureVisual visual={visual} />;
    case 'figureBullets': return <FigureBulletsVisual visual={visual} />;
    case 'splitFigures': return <SplitFiguresVisual visual={visual} />;
    case 'metrics': return <MetricsVisual visual={visual} />;
    case 'bullets': return <BulletsVisual visual={visual} />;
    case 'formula': return <FormulaVisual visual={visual} />;
    case 'result': return <ResultVisual visual={visual} />;
    case 'methodCard': return <MethodCardVisual visual={visual} />;
    default: return null;
  }
}
