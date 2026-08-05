'use client';

import React, { useEffect, useRef, useState } from 'react';

const TOTAL_FRAMES = 193;

export const HeroSequence: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));

  useEffect(() => {
    let isMounted = true;

    // Load initial 5 keyframes first to start playback instantly
    const loadBatch = (startIndex: number, batchSize: number, onComplete?: () => void) => {
      let loadedInBatch = 0;
      const endIndex = Math.min(startIndex + batchSize, TOTAL_FRAMES);

      for (let i = startIndex; i < endIndex; i++) {
        if (imagesRef.current[i]) {
          loadedInBatch++;
          if (loadedInBatch === endIndex - startIndex && onComplete) onComplete();
          continue;
        }

        const img = new Image();
        const frameNum = String(i + 1).padStart(5, '0');
        img.src = `/hero_frames/frame_${frameNum}.png`;

        img.onload = img.onerror = () => {
          if (!isMounted) return;
          imagesRef.current[i] = img;
          loadedInBatch++;

          if (i === 4 && !isStarted) {
            setIsStarted(true);
          }

          if (loadedInBatch === endIndex - startIndex && onComplete) {
            onComplete();
          }
        };
      }
    };

    // Load initial batch of 5 frames
    loadBatch(0, 5, () => {
      if (!isMounted) return;
      setIsStarted(true);

      // Progressively load remaining frames in small background batches to prevent HTTP socket saturation
      let currentIdx = 5;
      const interval = setInterval(() => {
        if (!isMounted || currentIdx >= TOTAL_FRAMES) {
          clearInterval(interval);
          return;
        }
        loadBatch(currentIdx, 10);
        currentIdx += 10;
      }, 150);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let currentFrameIndex = 0;
    let lastTimestamp = 0;
    const fps = 24; // Smooth 24 FPS animation speed
    const frameDuration = 1000 / fps;

    const renderFrame = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;

      if (elapsed > frameDuration) {
        lastTimestamp = timestamp - (elapsed % frameDuration);
        
        // Find next available frame
        let nextIndex = (currentFrameIndex + 1) % TOTAL_FRAMES;
        let attempts = 0;
        while (!imagesRef.current[nextIndex] && attempts < TOTAL_FRAMES) {
          nextIndex = (nextIndex + 1) % TOTAL_FRAMES;
          attempts++;
        }
        currentFrameIndex = nextIndex;

        const img = imagesRef.current[currentFrameIndex];
        if (img && img.complete && img.naturalWidth > 0) {
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const imgWidth = img.naturalWidth;
          const imgHeight = img.naturalHeight;

          const imgRatio = imgWidth / imgHeight;
          const canvasRatio = canvasWidth / canvasHeight;

          let drawWidth = canvasWidth;
          let drawHeight = canvasHeight;
          let offsetX = 0;
          let offsetY = 0;

          if (canvasRatio > imgRatio) {
            drawHeight = canvasWidth / imgRatio;
            offsetY = (canvasHeight - drawHeight) / 2;
          } else {
            drawWidth = canvasHeight * imgRatio;
            offsetX = (canvasWidth - drawWidth) / 2;
          }

          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
      }

      animationFrameId = requestAnimationFrame(renderFrame);
    };

    const updateCanvasSize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.clientWidth * window.devicePixelRatio;
        canvasRef.current.height = canvasRef.current.clientHeight * window.devicePixelRatio;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    animationFrameId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <section className="relative w-full h-[55vh] md:h-[75vh] bg-neutral-900 overflow-hidden shadow-xl rounded-b-3xl transition-all">
      {!isStarted && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950 text-white z-10">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-medium tracking-wide text-neutral-300">
            Initializing Hero Animation...
          </p>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover"
        style={{ width: '100%', height: '100%' }}
      />
    </section>
  );
};
