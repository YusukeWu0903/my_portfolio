'use client';

import { useCallback, useEffect, useEffectEvent, useMemo, useReducer, useState } from 'react';
import { createProjectShuffle } from './lib/projectShuffle';

export function useIdleProjectPreview(ids: readonly string[], enabled: boolean, onPreview: (id: string) => void) {
  // Pausing preserves the remaining tour; changing districts starts a new tour.
  const tour = useMemo(() => createProjectShuffle(ids), [ids]);
  const [holds, setHolds] = useState<ReadonlySet<string>>(() => new Set());
  const [activity, recordActivity] = useReducer(value => value + 1, 0);
  const preview = useEffectEvent(onPreview);
  const hold = useCallback((source: string, active: boolean) => {
    setHolds(previous => {
      if (previous.has(source) === active) return previous;
      const next = new Set(previous);
      if (active) next.add(source); else next.delete(source);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!enabled || holds.size || !ids.length) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      clearTimeout(timer);
      if (document.hidden) return;
      timer = setTimeout(() => {
        const id = tour.next();
        if (id) preview(id);
        schedule();
      }, 5000);
    };
    schedule();
    document.addEventListener('visibilitychange', schedule);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', schedule);
    };
  }, [tour, ids, enabled, holds, activity]);
  return { hold, recordActivity };
}
