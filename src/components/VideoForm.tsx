/**
 * File: src/components/VideoForm.tsx
 * 설명: 유튜브 URL과 태그를 입력하여 동영상을 추가하는 폼 컴포넌트
 */

import React, { useState } from 'react';
import { extractYouTubeId } from '../utils/youtube';
import { VideoItem } from '../types';
import { Tag } from 'lucide-react';

interface Props {
  onAdd: (video: VideoItem) => void;
}

/**
 * VideoForm 컴포넌트
 * - URL과 태그(쉼표 구분)를 입력받아 부모에 VideoItem 전달
 */
export default function VideoForm({ onAdd }: Props) {
  const [url, setUrl] = useState('');
  const [tagInput, setTagInput] = useState('');

  /**
   * 현재 입력값을 토대로 VideoItem을 생성하여 부모에 전달
   */
  function handleAdd(e?: React.FormEvent) {
    e?.preventDefault();
    const id = extractYouTubeId(url);
    if (!id) {
      alert('유효한 YouTube URL 또는 ID를 입력하세요.');
      return;
    }
    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const video: VideoItem = {
      id,
      url,
      title: undefined,
      tags,
    };
    onAdd(video);
    setUrl('');
    setTagInput('');
  }

  return (
    <form onSubmit={handleAdd} className="space-y-2">
      <label className="block text-sm font-medium">YouTube URL or ID</label>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://youtu.be/..."
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-300"
      />
      <label className="block text-sm font-medium">Tags (comma separated)</label>
      <div className="flex gap-2">
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="tag1, tag2"
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-300"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
        >
          <div className="flex items-center gap-2">
            <Tag size={16} />
            <span>Add</span>
          </div>
        </button>
      </div>
    </form>
  );
}