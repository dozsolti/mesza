import React, { useEffect, useRef, useState } from 'react';

interface SwipeToConfirmProps {
  onConfirm?: () => void;
  label?: string;
  confirmedLabel?: string;
  width?: number;
  height?: number;
  restartable?: boolean;
  restartDelay?: number; // in milliseconds, default 1500
  bgColor?: string; // Tailwind bg class for default
  confirmedBgColor?: string; // Tailwind bg class for confirmed
  knobColor?: string; // CSS color for knob
  knobSpace?: number; // space around the knob in px, default 10
  knobIconColor?: string; // CSS color for knob
  confirmedKnobColor?: string; // CSS color for knob when confirmed
  textColor?: string; // Tailwind text class for default
  confirmedTextColor?: string; // Tailwind text class for confirmed
  borderRadius?: number; // px
  swipeThreshold?: number; // percent (0-1), default 0.85
  icon?: React.ReactNode; // custom icon
  isConfirmed?: boolean; // externally controlled confirmed state
}

export const SwipeToConfirm: React.FC<SwipeToConfirmProps> = ({
  onConfirm,
  label = "Swipe to confirm",
  confirmedLabel = "Confirmed!",
  width,
  height = 48,
  restartable = false,
  restartDelay = 800,
  bgColor = "bg-card-foreground/10",
  confirmedBgColor = "transparent",
  knobColor = "#fff",
  knobIconColor = "#4caf50",
  confirmedKnobColor = "#388e3c",
  textColor = "text-gray-500",
  confirmedTextColor = "text-white",
  borderRadius,
  swipeThreshold = 0.9,
  knobSpace = 10,
  icon,
  isConfirmed: externalConfirmed,
}) => {
  const [dragX, setDragX] = useState(0);
  const targetDragX = useRef(0);
  const animationFrame = useRef<number | null>(null);
  const [confirmed, setConfirmed] = useState(externalConfirmed || false);

  useEffect(() => {
    if (confirmed && restartable && !externalConfirmed) {
      const timer = setTimeout(() => {
        setConfirmed(false);
        setDragX(0);
      }, restartDelay);
      return () => clearTimeout(timer);
    }
  }, [confirmed, externalConfirmed, restartDelay, restartable]);

  const dragging = useRef(false);
  const startX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(width || 0);
  const maxDrag = containerWidth - height;

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true;
    startX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  };

  // Ease out function
  function easeOut(current: number, target: number, factor = 0.25) {
    return current + (target - current) * factor;
  }

  // Animate dragX towards targetDragX
  const animateDrag = () => {
    setDragX((prev) => {
      const next = easeOut(prev, targetDragX.current);
      if (Math.abs(next - targetDragX.current) < 0.5) {
        return targetDragX.current;
      }
      animationFrame.current = requestAnimationFrame(animateDrag);
      return next;
    });
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging.current || confirmed) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    let delta = clientX - startX.current;
    delta = Math.max(0, Math.min(delta, maxDrag));
    targetDragX.current = delta;
    if (!animationFrame.current) {
      animationFrame.current = requestAnimationFrame(animateDrag);
    }
  };

  const handleDragEnd = () => {
    if (dragX > maxDrag * swipeThreshold && !confirmed) {
      setConfirmed(true);
      targetDragX.current = maxDrag;
      setDragX(maxDrag);
      onConfirm?.();
    } else {
      targetDragX.current = 0;
      setDragX(0);
    }
    dragging.current = false;
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  };

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none transition-colors duration-500 flex items-center ${
        confirmed ? confirmedBgColor : bgColor
      }
      ${confirmed ? "text-xl animate-out" : "shadow-md"}
      `}
      style={{ height, borderRadius: borderRadius ?? height / 2 }}
    >
      <div
        className={`absolute left-0 top-0 w-full h-full flex items-center justify-center font-medium pointer-events-none transition-colors duration-300 ${
          confirmed ? confirmedTextColor : textColor
        }`}
      >
        {confirmed ? confirmedLabel : label}
      </div>
      <div
        className={`absolute top-0 flex items-center justify-center shadow-lg transition-colors duration-300 z-1`}
        style={{
          left: dragX,
          width: height - knobSpace,
          height: height - knobSpace,
          margin: knobSpace / 2,
          borderRadius: "50%",
          background: confirmed ? confirmedKnobColor : knobColor,
          opacity: confirmed ? 0 : 1,
          cursor: confirmed ? "default" : "grab",
          touchAction: "none",
        }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {icon ? (
          icon
        ) : (
          <svg
            width={height * 0.5}
            height={height * 0.5}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M8 5v14l11-7L8 5z"
              fill={confirmed ? "#fff" : knobIconColor}
            />
          </svg>
        )}
      </div>

      {/* Automatically restarts after confirmation, no manual button needed */}
    </div>
  );
};
