/**
 * File: src/utils/youtube.ts
 * 설명: YouTube 관련 유틸리티 함수들
 */

/**
 * 유튜브 URL에서 비디오 ID를 추출합니다.
 * @param url - 유튜브 URL 또는 ID
 * @returns 비디오 ID 또는 null
 */
export function extractYouTubeId(url: string): string | null {
  // 직접 ID가 들어온 경우 (11자 이상)
  const raw = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  // 일반적인 URL 패턴에서 id 추출
  const patterns = [
    /v=([a-zA-Z0-9_-]{11})/, // ?v=ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/, // youtu.be/ID
    /embed\/([a-zA-Z0-9_-]{11})/, // /embed/ID
    /\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const p of patterns) {
    const m = raw.match(p);
    if (m && m[1]) return m[1];
  }

  return null;
}

/**
 * 유튜브 썸네일 URL 생성
 * @param id - 비디오 ID
 * @returns 썸네일 URL
 */
export function getThumbnailUrl(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}