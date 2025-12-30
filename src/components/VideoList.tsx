/**
 * File: src/components/VideoList.tsx
 * 설명: 플레이리스트 항목 목록 (썸네일, 제목, 태그) - 클릭 시 재생 요청을 전달
 *
 * - 불필요한 컨트롤(삭제/이동 등)은 제거하여 심플한 목록만 표시합니다.
 */

import React from 'react';
import { VideoItem } from '../types';
import { getThumbnailUrl } from '../utils/youtube';

interface Props {
  videos: VideoItem[];
  currentId: string | null;
  onSelect: (id: string) => void;
}

/**
 * VideoList 컴포넌트
 */
export default function VideoList({ videos, currentId, onSelect }: Props) {
  return (
    <div className="space-y-3">
      {videos.length === 0 && <div className="text-sm text-gray-500">No videos.</div>}
      {videos.map((v) => {
        const active = currentId === v.id;
        return (
          <div
            key={v.id}
            onClick={() => onSelect(v.id)}
            className={`flex gap-3 items-center p-2 rounded-md cursor-pointer transition-shadow ${
              active ? 'ring-2 ring-sky-200 bg-sky-50' : 'bg-white hover:shadow-sm'
            }`}
          >
            <img
              src={getThumbnailUrl(v.id)}
              alt={v.title || v.id}
              className="w-24 h-14 object-cover rounded-sm flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate text-gray-800">{v.title || v.id}</div>
              <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-1">
                {v.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-400">{/* provider area for time/duration if needed */}</div>
          </div>
        );
      })}
    </div>
  );
}