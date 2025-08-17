import React from "react";
import { useI18n } from "../providers/I18nProvider";
export function Devices() {
  const { t } = useI18n();
  return (
    <div className="card">
      <h3 className="text-lg font-semibold">{t("devices") || "Devices"}</h3>
      <p className="opacity-80">
        Fitbit enabled; Apple Health disabled for this tenant.
      </p>
    </div>
  );
}
