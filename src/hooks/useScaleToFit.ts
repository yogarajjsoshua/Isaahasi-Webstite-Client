import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Measures the available width of a wrapper element and computes a scale
 * factor so a fixed-width "stage" of `designWidth` can be scaled uniformly
 * to fill it exactly, preserving every internal proportion exactly as
 * designed. Scales both down (narrower screens) and up (wider screens) so
 * the stage always spans the full width of its wrapper.
 */
export function useScaleToFit(designWidth: number) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [stageHeight, setStageHeight] = useState(0);

  useLayoutEffect(() => {
    const update = () => {
      const wrapperWidth = wrapperRef.current?.offsetWidth ?? designWidth;
      const naturalHeight = stageRef.current?.offsetHeight ?? 0;
      const nextScale = wrapperWidth / designWidth;

      setScale(nextScale);
      setStageHeight(naturalHeight * nextScale);
    };

    update();

    const resizeObserver = new ResizeObserver(update);
    if (wrapperRef.current) resizeObserver.observe(wrapperRef.current);
    if (stageRef.current) resizeObserver.observe(stageRef.current);

    window.addEventListener('resize', update);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [designWidth]);

  return { wrapperRef, stageRef, scale, stageHeight };
}
