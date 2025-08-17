import React from "react";
export default function ProgramCard({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="card border-2 border-dashed">
      <h3 className="text-lg font-semibold">✨ ACME: {title}</h3>
      <p className="opacity-80">{description ?? "—"}</p>
      <div className="mt-3 flex gap-2">
        <button className="btn">Start</button>
        <button className="px-4 py-2 rounded-lg border">Details</button>
      </div>
    </div>
  );
}
