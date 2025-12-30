/**
 * File: src/pages/Home.tsx
 * 설명: 메인 페이지 - 반응형 레이아웃(데스크톱: 좌측 2/3 플레이어, 우측 1/3 플레이리스트 / 모바일: 세로 스택)
 *
 * - 내부 SAMPLE_VIDEOS 데이터를 사용합니다.
 * - 태그 필터(AND)와 스크롤 가능한 플레이리스트가 우측에 위치합니다.
 * - 플레이리스트 항목 클릭 시 좌측 플레이어에서 재생됩니다.
 */

import React, {JSX, useMemo, useState} from 'react';
import Player from '../components/Player';
import TagFilter from '../components/TagFilter';
import VideoList from '../components/VideoList';
import { SAMPLE_VIDEOS } from '../data/sampleVideos';
import { VideoItem } from '../types';

/**
 * Home 컴포넌트
 * - 페이지 전체 레이아웃과 주요 상태를 관리합니다.
 */
export default function Home(): JSX.Element {
  // 내부 샘플 비디오 목록 (읽기 전용)
  const [videos] = useState<VideoItem[]>(SAMPLE_VIDEOS);

  // 선택된 태그 목록 (AND 필터링)
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 현재 재생중인 비디오 ID
  const [currentId, setCurrentId] = useState<string | null>(videos[0]?.id ?? null);

  /**
   * 전체 태그 집합을 계산합니다.
   */
  const allTags = useMemo(() => {
    const s = new Set<string>();
    for (const v of videos) v.tags.forEach((t) => s.add(t));
    return Array.from(s).sort();
  }, [videos]);

  /**
   * 태그 토글 처리 (선택되어있으면 해제, 아니면 추가)
   * @param tag - 토글할 태그
   */
  function toggleTag(tag: string) {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function playNext() {
    if (filtered.length === 0) return;

    console.log('aaaa', filtered, currentId);

    const idx = filtered.findIndex((v) => v.id === currentId);
    const nextIdx = idx < 0 ? 0 : idx + 1;
    const safeIdx = nextIdx >= filtered.length ? 0 : nextIdx;

    console.log('setCurrentId', filtered[safeIdx].id);
    setCurrentId(filtered[safeIdx].id);
  }

  /**
   * 선택된 태그로 AND 방식 필터링된 비디오 목록을 반환합니다.
   */
  const filtered = useMemo(() => {
    if (selectedTags.length === 0) return videos;
    return videos.filter((v) => selectedTags.every((t) => v.tags.includes(t)));
  }, [videos, selectedTags]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-sky-600">유고 유즈키 플레이리스트</h1>
          <p className="text-sm text-gray-600">플리 공개를 안하면 직접 만들면 된다.</p>
        </header>

        {/* 반응형 그리드: md(768px) 이상에서 3열, 왼쪽이 2칸 차지 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* 왼쪽 플레이어 (md 이상에서 2/3 차지) */}
          <section className="md:col-span-2">
            <div className="bg-white rounded-md shadow-sm border border-gray-100 p-4">
              <h2 className="text-lg font-medium text-gray-800 mb-3">유튜브 플레이어</h2>
              <div className="w-full rounded-md overflow-hidden bg-black/5" style={{ aspectRatio: '16/9', minHeight: 220 }}>
                <Player currentVideoId={currentId} onEnded={playNext} />
              </div>
            </div>
          </section>

          {/* 오른쪽 플레이리스트 (md 이상에서 1/3 차지) */}
          <aside>
            <div className="bg-white rounded-md shadow-sm border border-gray-100 p-4 flex flex-col" style={{ minHeight: 220 }}>
              <h2 className="text-lg font-medium text-gray-800 mb-3">플레이리스트</h2>

              {/* 태그 필터 */}
              <TagFilter allTags={allTags} selected={selectedTags} onToggle={toggleTag} />

              <div className="text-sm text-gray-500 mb-3">총 {filtered.length}개 항목 표시</div>

              {/* 스크롤 가능한 리스트 영역 */}
              <div className="overflow-y-auto p-1" style={{ maxHeight: '60vh' }}>
                <VideoList videos={filtered} currentId={currentId} onSelect={(id) => setCurrentId(id)} />
              </div>
            </div>
          </aside>
        </div>

        <footer className="text-xs text-gray-500 mt-6">
          심플하고 깔끔한 레이아웃 — 밝은 톤과 적당한 여백을 사용했습니다.
        </footer>
      </div>
    </div>
  );
}