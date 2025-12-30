/**
 * File: src/components/Player.tsx
 * 설명: 좌측 유튜브 플레이어 컴포넌트
 *
 * - 외부 YouTube IFrame API를 로드하고 단일 videoId를 재생합니다.
 * - currentVideoId가 변경되면 해당 영상을 loadVideoById + playVideo()로 재생 시도합니다.
 * - 사용자가 플레이리스트 항목을 클릭하는 상호작용으로 재생이 트리거되면 브라우저의 autoplay 정책에 의해 차단될 가능성이 적습니다.
 */

import React, { useEffect, useRef } from 'react';

interface Props {
  currentVideoId: string | null;
  className?: string;
  onEnded?: () => void;
}

/**
 * 전역 YT 타입 보조
 */
declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT: any;
    __ytApiPromise?: Promise<void>;
  }
}

/**
 * Player 컴포넌트
 * @param currentVideoId - 재생할 유튜브 비디오 ID (null이면 정지)
 */
export default function Player({ currentVideoId, className = '', onEnded }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const pendingLoadRef = useRef<string | null>(null);

  /**
   * YouTube IFrame API를 로드합니다.
   */
  function ensureYouTubeAPILoaded(): Promise<void> {
    if (window.__ytApiPromise) return window.__ytApiPromise;

    window.__ytApiPromise = new Promise<void>((resolve) => {
      if (window.YT && window.YT.Player) return resolve();

      const existing = document.querySelector('script[data-yt-api]');
      const prev = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve();
      };

      if (!existing) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.setAttribute('data-yt-api', '1');
        document.body.appendChild(tag);
      }
    });

    return window.__ytApiPromise;
  }

  /**
   * player 인스턴스를 생성합니다.
   */
  useEffect(() => {
    let mounted = true;
    ensureYouTubeAPILoaded().then(() => {
      if (!mounted) return;
      if (!playerRef.current && containerRef.current) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          height: '100%',
          width: '100%',
          playerVars: {
            controls: 1,
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onReady: (ev: any) => {
              // 준비 중에 대기중인 로드 요청이 있으면 처리
              const pending = pendingLoadRef.current;
              if (pending) {
                try {
                  ev.target.loadVideoById({ videoId: pending, startSeconds: 0 });
                  ev.target.playVideo?.();
                } catch {}
                pendingLoadRef.current = null;
              }
            },
            onStateChange: (ev: any) => {
              if (ev.data === 0) {
                onEnded?.();
              }
            },
          },
        });
      }
    });
    return () => {
      mounted = false;
    };
    // 빈 deps: 한 번만 로드
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * currentVideoId 변경 시 로드 및 재생 시도
   */
  useEffect(() => {
    if (!playerRef.current) {
      // 아직 준비되지 않았다면 pending으로 저장
      pendingLoadRef.current = currentVideoId;
      return;
    }
    try {
      if (currentVideoId) {
        playerRef.current.loadVideoById({ videoId: currentVideoId, startSeconds: 0 });
        // 명시적으로 재생 호출(사용자 클릭으로 트리거되는 경우 autoplay 허용)
        playerRef.current.playVideo?.();
      } else {
        playerRef.current.stopVideo?.();
      }
    } catch {
      // 무시
    }
  }, [currentVideoId]);

  return (
    <div className={`w-full h-full ${className}`}>
      <div
        ref={containerRef}
        id="yt-player"
        className="w-full bg-black/5 rounded-md overflow-hidden"
      />
    </div>
  );
}