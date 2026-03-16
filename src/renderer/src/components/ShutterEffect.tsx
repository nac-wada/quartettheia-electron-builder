// src/components/calibrationExtrinsic/ShutterEffect.tsx
import React from "react";

interface ShutterEffectProps {
  showShutterEffect: boolean;
}

const ShutterEffect: React.FC<ShutterEffectProps> = ({ showShutterEffect }) => {
  return showShutterEffect ? (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.1)',
        //background: 'rgba(0, 0, 0, 0.1)',
        zIndex: 1,
      }}
    />
  ) : null;
};

export default ShutterEffect;
