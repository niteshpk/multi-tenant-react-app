import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Messages = Record<string, string>;
type Ctx = { t: (key: string) => string; locale: string };

const I18nCtx = createContext<Ctx>({ t: (k) => k, locale: "en" });
export const useI18n = () => useContext(I18nCtx);

export function I18nProvider({
  locale,
  messagesUrl,
  children,
}: {
  locale: string;
  messagesUrl?: string;
  children: React.ReactNode;
}) {
  const [msgs, setMsgs] = useState<Messages>({});

  useEffect(() => {
    let active = true;
    (async () => {
      if (!messagesUrl) {
        setMsgs({});
        return;
      }
      try {
        const res = await fetch(messagesUrl, { cache: "no-store" });
        if (!active) return;
        if (!res.ok) {
          console.warn("i18n bundle not found:", messagesUrl, res.status);
          setMsgs({});
          return;
        }
        setMsgs(await res.json());
      } catch (e) {
        console.warn("i18n bundle parse/fetch failed:", messagesUrl, e);
        setMsgs({});
      }
    })();
    return () => {
      active = false;
    };
  }, [messagesUrl]);

  const t = useMemo(() => (key: string) => msgs[key] ?? key, [msgs]);
  const ctx = useMemo(() => ({ t, locale }), [t, locale]);

  return <I18nCtx.Provider value={ctx}>{children}</I18nCtx.Provider>;
}
