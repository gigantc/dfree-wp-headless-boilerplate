import React, { useEffect, useState } from 'react';
import styles from './cursor.module.scss';

const Cursor = () => {

  
  //////////////////////////////////////
  // STATE
  const [isHovering, setIsHovering] = useState(false);
  const [isButtoning, setIsButtoning] = useState(false);

  //////////////////////////////////////
  // RUN-TIME
  useEffect(() => {
    let animationFrameId;

    const updateMousePosition = (e) => {
      // Passing CSS variables for smoother updates
      // better than inline styles
      animationFrameId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
      });
    };

    const handleMouseOver = (e) => {
      // Check if hovered element has cursorHover class
      if (e.target.closest('a')) {
        setIsHovering(true);
      }
      if (e.target.closest('button')) {
        setIsButtoning(true);
      }
    };

    const handleMouseOut = (e) => {
      // Reset hover state
      if (e.target.closest('a')) {
        setIsHovering(false);
      }
      if (e.target.closest('button')) {
        setIsButtoning(false);
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
    <div className=
    {`
      ${styles.customCursor} 
      ${isHovering ? styles.hovering : ''} 
      ${isButtoning ? styles.buttoning : ''}
    `} />
  );
};

export default Cursor;
