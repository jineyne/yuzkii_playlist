/**
 * File: src/components/TagFilter.tsx
 * 설명: 플레이리스트 상단에 보여질 태그 필터 컴포넌트
 *
 * - 간단한 토글 버튼 형태로 태그들을 보여줍니다.
 * - 선택된 태그는 부모에 전달된 onToggle로 토글됩니다.
 */

import React from 'react';
import { Tag } from 'lucide-react';

interface Props {
  allTags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
}

/**
 * TagFilter 컴포넌트
 */
export default function TagFilter({ allTags, selected, onToggle }: Props) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-2">
        <Tag size={16} className="text-sky-500" />
        <h3 className="text-sm font-medium text-gray-700">Filter by tags</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {allTags.length === 0 && <div className="text-sm text-gray-400">No tags</div>}
        {allTags.map((t) => {
          const sel = selected.includes(t);
          return (
            <button
              key={t}
              onClick={() => onToggle(t)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                sel
                  ? 'bg-sky-500 text-white border-transparent'
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}