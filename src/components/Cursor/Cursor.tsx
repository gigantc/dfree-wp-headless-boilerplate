'use client';
import React, { useEffect, useState } from 'react';
import styles from './Cursor.module.scss';

const Cursor = () => {

  
  //////////////////////////////////////
  // STATE
  const [isHovering, setIsHovering] = useState(false);

  //////////////////////////////////////
  // RUN-TIME
  useEffect(() => {
    let animationFrameId: number;

    const updateMousePosition = (e: MouseEvent) => {
      // Passing CSS variables for smoother updates
      // better than inline styles
      animationFrameId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      // Check if hovered element has cursorHover class
      if ((e.target as Element).closest('.cursorHover')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      // Reset hover state
      if ((e.target as Element).closest('.cursorHover')) {
        setIsHovering(false);
      }
    };

    // EVENT LISTENERS
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    // CLEANUP
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  //////////////////////////////////////
  // RENDER
  return (
    <div className={`${styles['custom-cursor']} ${isHovering ? styles.hovering : ''}`} />
  );
};

export default Cursor;
