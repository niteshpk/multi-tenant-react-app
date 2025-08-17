import React from "react";
import { Navigate } from "react-router-dom";
import { useFlagEnabled } from "../providers/FeatureFlagProvider";
import { useTenant } from "../providers/TenantProvider";
import { hasPerm } from "../lib/permissions";

export function GuardedRoute({
  element,
  flag,
  perm,
}: {
  element: React.ReactElement;
  flag?: string;
  perm?: string | string[];
}) {
  const allowFlag = flag ? useFlagEnabled(flag) : true;
  const { permissions } = useTenant();
  const allowPerm = perm ? hasPerm(permissions, perm) : true;

  if (!allowFlag || !allowPerm) return <Navigate to="/dashboard" replace />;
  return element;
}
