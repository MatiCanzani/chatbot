import React, { useEffect, useRef } from 'react';

const AlwaysScrollToBottom: React.FC = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  });

  return <div ref={elementRef} />;
};

export default AlwaysScrollToBottom;
