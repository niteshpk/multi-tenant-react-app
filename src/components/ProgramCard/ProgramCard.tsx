import React from "react";
import { useTenant } from "../../providers/TenantProvider";
import { loadOverride } from "../../lib/dynamicOverride";

type Props = { title: string; description?: string };

export default function ProgramCard(props: Props) {
  const tenant = useTenant();
  const [Override, setOverride] =
    React.useState<React.ComponentType<Props> | null>(null);

  React.useEffect(() => {
    let active = true;
    loadOverride<React.ComponentType<Props>>(tenant.id, "ProgramCard").then(
      (Comp) => {
        if (active) setOverride(Comp);
      }
    );
    return () => {
      active = false;
    };
  }, [tenant.id]);

  const Base = (
    <div className="card">
      <h3 className="text-lg font-semibold">{props.title}</h3>
      <p className="opacity-80">{props.description ?? "—"}</p>
      <button className="btn mt-3">Open</button>
    </div>
  );

  return Override ? <Override {...props} /> : Base;
}
