/**
 * File: src/hooks/useLocalStorage.ts
 * 설명: 로컬스토리지와 동기화되는 간단한 React 훅
 */

import { useEffect, useState } from 'react';

/**
 * 로컬 스토리지와 상태를 동기화하는 훅
 * @param key - 로컬스토리지 키
 * @param initial - 초기값
 * @returns [value, setValue]
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // 실패 무시
    }
  }, [key, state]);

  return [state, setState] as const;
}