'use client';

import React, { useEffect, useRef, useState } from 'react';

const TOTAL_FRAMES = 193;

export const HeroSequence: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));

  useEffect(() => {
    let isMounted = true;

    // Load initial frame 1 immediately
    const img1 = new Image();
    img1.src = '/hero_frames/frame_00001.png';
    img1.onload = () => {
      if (isMounted) imagesRef.current[0] = img1;
    };

    // Progressively load remaining frames in small background batches
    let currentIdx = 1;
    const interval = setInterval(() => {
      if (!isMounted || currentIdx >= TOTAL_FRAMES) {
        clearInterval(interval);
        return;
      }

      const endIndex = Math.min(currentIdx + 8, TOTAL_FRAMES);
      for (let i = currentIdx; i < endIndex; i++) {
        if (!imagesRef.current[i]) {
          const img = new Image();
          const frameNum = String(i + 1).padStart(5, '0');
          img.src = `/hero_frames/frame_${frameNum}.png`;
          img.onload = () => {
            if (isMounted) imagesRef.current[i] = img;
          };
        }
      }
      currentIdx += 8;
    }, 100);

    return () => {
      isMounted = false;
      clearInterval(interval);
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
    const fps = 24;
    const frameDuration = 1000 / fps;

    const renderFrame = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;

      if (elapsed > frameDuration) {
        lastTimestamp = timestamp - (elapsed % frameDuration);
        
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
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover bg-[url('/hero_frames/frame_00001.png')] bg-cover bg-center"
        style={{ width: '100%', height: '100%' }}
      />
    </section>
  );
};
