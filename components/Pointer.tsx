
import React, { useState, useEffect } from 'react';

interface PointerProps {
  label: string;
  index: number;
  color: string;
  textColor: string;
  boxWidth: number;
}

const Pointer: React.FC<PointerProps> = ({ label, index, color, textColor, boxWidth }) => {
  const [leftPosition, setLeftPosition] = useState(0);
  
  useEffect(() => {
    const updatePosition = () => {
      const container = document.querySelector('.array-container');
      if (container && container.children[index]) {
        const child = container.children[index] as HTMLElement;
        const containerRect = container.getBoundingClientRect();
        const childRect = child.getBoundingClientRect();
        
        // Calculate relative left offset within the container
        const offset = (childRect.left - containerRect.left) + (childRect.width / 2);
        setLeftPosition(offset);
      }
    };

    updatePosition();
    
    // We listen for layout shifts by monitoring window size
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [index, boxWidth]);

  // Adjust stacking order based on index to handle pointer overlaps if they occur
  const zIndex = label === 'i' ? 30 : (label === 'lt' ? 20 : 10);

  return (
    <div 
      className={`absolute top-2 transition-all duration-300 ease-in-out flex flex-col items-center pointer-events-none`}
      style={{ 
        left: `${leftPosition}px`, 
        transform: 'translateX(-50%)',
        zIndex: zIndex
      }}
    >
      <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${color} transform rotate-45 mb-1 shadow-sm`}></div>
      <span className={`text-[10px] sm:text-sm font-bold uppercase ${textColor} leading-tight`}>{label}</span>
      <span className="text-[9px] text-slate-400 mt-0">({index})</span>
    </div>
  );
};

export default Pointer;
