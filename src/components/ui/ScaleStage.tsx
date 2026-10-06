import React from 'react';
import { useScaleToFit } from '../../hooks/useScaleToFit';
import './ScaleStage.css';

type ScaleStageProps = {
  designWidth?: number;
  children: React.ReactNode;
};

/**
 * Scales a fixed-width block of content uniformly to fill the available
 * width, so sections grow/shrink proportionally instead of reflowing at
 * breakpoints. Exposes the current factor as the `--stage-scale` CSS
 * variable so text can counter-scale (font-size / var(--stage-scale)) and
 * render at its original, un-scaled size.
 */
export const ScaleStage: React.FC<ScaleStageProps> = ({ designWidth = 1440, children }) => {
  const { wrapperRef, stageRef, scale, stageHeight } = useScaleToFit(designWidth);

  return (
    <div
      ref={wrapperRef}
      className="scale-stage-wrapper"
      style={{ height: stageHeight || undefined }}
    >
      <div
        ref={stageRef}
        className="scale-stage"
        style={{
          width: designWidth,
          transform: `scale(${scale})`,
          '--stage-scale': scale,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
};
