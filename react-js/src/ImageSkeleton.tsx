// src/ImageSkeleton.tsx
import React from 'react';
import './ImageSkeleton.css';

interface ImageSkeletonProps {
  className?: string;
}

const ImageSkeleton: React.FC<ImageSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`image-skeleton-wrapper ${className}`}>
      <div className="image-skeleton-aspect-ratio-box">
        <div className="image-skeleton">
          No hits yet ... still searching
        </div>
      </div>
    </div>
  );
};

export default ImageSkeleton;

// Example usage:
export const Example = () => (
  <div style={{ height: '300px' }}>
    <ImageSkeleton />
  </div>
);