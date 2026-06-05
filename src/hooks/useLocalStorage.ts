import { useCallback, useEffect, useState } from 'react';

type SetValue<T> = T | ((previousValue: T) => T);

function readStorageValue<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? (JSON.parse(storedValue) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: SetValue<T>) => void] {
  const [value, setValue] = useState<T>(() => readStorageValue(key, defaultValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be unavailable in private browsing or embedded previews.
    }
  }, [key, value]);

  const updateValue = useCallback((nextValue: SetValue<T>) => {
    setValue((previousValue) =>
      typeof nextValue === 'function'
        ? (nextValue as (previousValue: T) => T)(previousValue)
        : nextValue,
    );
  }, []);

  return [value, updateValue];
}
