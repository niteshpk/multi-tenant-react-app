import React, { createContext, useContext } from "react";

type Flags = Record<string, boolean | string>;

const FlagCtx = createContext<Flags>({});
export const useFlag = (name: string) => {
  const flags = useContext(FlagCtx);
  return flags[name];
};
export const useFlagEnabled = (name: string) => !!useFlag(name);

export function FeatureFlagProvider({
  flags,
  children,
}: {
  flags: Flags;
  children: React.ReactNode;
}) {
  return <FlagCtx.Provider value={flags}>{children}</FlagCtx.Provider>;
}
