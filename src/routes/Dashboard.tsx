import React from "react";
import { useTenant } from "../providers/TenantProvider";
import { useFlag } from "../providers/FeatureFlagProvider";
import { useI18n } from "../providers/I18nProvider";
import { ProgramCard } from "../components/ProgramCard";

export function Dashboard() {
  const tenant = useTenant();
  const { t } = useI18n();
  const programFlag = useFlag("modules.programBuilder");

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        {t("welcome")} — {tenant.displayName}
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <ProgramCard
          title={t("programs")}
          description="Lifestyle, Sleep, Nutrition"
        />
        <div className="card">
          <div className="text-sm opacity-70">programBuilder flag:</div>
          <div className="font-mono">{String(programFlag)}</div>
        </div>
      </div>
    </div>
  );
}
