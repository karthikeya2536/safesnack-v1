export function SectionHeading({ title, body, kicker }: { title: string; body?: string; kicker?: string }) {
  return (
    <div>
      {kicker && <p className="ep-kicker">{kicker}</p>}
      <h2 className="ep-section-title mt-3">{title}</h2>
      {body && <p className="ep-copy mt-5">{body}</p>}
    </div>
  );
}
