/**
 * File: src/types.ts
 * 설명: 애플리케이션에서 사용하는 타입 정의를 포함합니다.
 */

/**
 * 비디오 항목 타입 정의
 */
export interface VideoItem {
  id: string; // 유튜브 비디오 ID
  url: string; // 원본 URL
  title?: string; // 표시할 제목 (선택)
  tags: string[]; // 태그 목록
}

/**
 * 저장할 플레이어 상태 타입
 */
export interface SavedState {
  selectedTags: string[]; // 현재 선택된 태그 조합
  order: string[]; // 비디오 id 순서 배열
  currentIndex: number; // 현재 재생중인 인덱스 (order 배열 기준)
  currentTime: number; // 현재 재생 시간(초)
}