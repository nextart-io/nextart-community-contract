import { useState, useEffect } from 'react';
import { TextItem } from '../config/textContent';

interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface LayoutElement extends TextItem {
  position: Position;
}

export const useTextLayout = (
  texts: TextItem[],
  screenWidth: number,
  screenHeight: number
): LayoutElement[] => {
  const [layoutElements, setLayoutElements] = useState<LayoutElement[]>([]);

  useEffect(() => {
    if (screenWidth === 0 || screenHeight === 0 || texts.length === 0) {
      return;
    }

    const calculateLayout = () => {
      const isMobile = screenWidth < 640;
      const PADDING = isMobile ? 40 : 80;
      const FONT_SCALE = isMobile ? 0.7 : 1;
      
      const gridColumns = isMobile 
        ? Math.ceil(Math.sqrt(texts.length) / 3) 
        : Math.ceil(Math.sqrt(texts.length));
      const gridRows = Math.ceil(texts.length / gridColumns);
      
      const cellWidth = (screenWidth - PADDING * 2) / gridColumns;
      const cellHeight = (screenHeight - PADDING * 2) / gridRows;

      const result: LayoutElement[] = [];
      
      texts.forEach((text, index) => {
        const gridX = index % gridColumns;
        const gridY = Math.floor(index / gridColumns);
        
        const fontSize = parseInt(text.style.fontSize) * FONT_SCALE;
        const estimatedWidth = text.text.length * (fontSize * 0.8);
        const estimatedHeight = fontSize * 1.5;
        
        const randomOffset = (size: number): number => 
          (Math.random() - 0.5) * size * (isMobile ? 0.2 : 0.3);
        
        let x = PADDING + gridX * cellWidth + cellWidth / 2 + randomOffset(cellWidth);
        let y = PADDING + gridY * cellHeight + cellHeight / 2 + randomOffset(cellHeight);

        x = Math.min(Math.max(x, PADDING + estimatedWidth/2), 
            screenWidth - PADDING - estimatedWidth/2);
        y = Math.min(Math.max(y, PADDING + estimatedHeight/2), 
            screenHeight - PADDING - estimatedHeight/2);

        const rotation = (Math.random() - 0.5) * (isMobile ? 15 : 20);

        const position: Position = {
          x,
          y,
          width: estimatedWidth,
          height: estimatedHeight,
          rotation
        };

        result.push({ 
          ...text, 
          position,
          style: {
            ...text.style,
            fontSize: `${fontSize}px`
          }
        });
      });

      return result;
    };

    const timeoutId = setTimeout(() => {
      const newLayout = calculateLayout();
      setLayoutElements(newLayout);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [texts, screenWidth, screenHeight]);

  return layoutElements;
};