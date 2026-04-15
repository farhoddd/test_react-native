import { useEffect, useState } from 'react';

import { bootstrapDeviceUserId } from '../auth/device-user';

export function useBootstrapAuth() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    bootstrapDeviceUserId()
      .then(() => {
        if (!cancelled) {
          setIsReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Не удалось подготовить безопасную сессию устройства');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { isReady, error };
}
