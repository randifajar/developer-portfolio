"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * "Copy address" for the footer email (UX3 7.7, DEC-057).
 *
 * The `mailto:` link beside it works without this. The button itself renders
 * only once the browser can actually copy — never as a dead control in a page
 * without JavaScript or without the Clipboard API. `useSyncExternalStore`
 * reports "no" during server rendering and hydration, then the real answer,
 * so there is no hydration mismatch and no effect that sets state.
 *
 * The outcome is announced through a polite live region, so a screen-reader
 * user hears that the copy happened rather than inferring it.
 */
const noSubscription = () => () => {};
const canCopy = () => typeof navigator !== "undefined" && Boolean(navigator.clipboard?.writeText);
const cannotCopyOnServer = () => false;

export function CopyEmail({ email }: { readonly email: string }) {
  const supported = useSyncExternalStore(noSubscription, canCopy, cannotCopyOnServer);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  if (!supported) {
    return null;
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-10 items-center rounded-full border border-border px-4 text-meta font-semibold text-text-secondary hover:border-accent hover:text-accent"
      >
        {copied ? "Copied" : "Copy address"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </>
  );
}
