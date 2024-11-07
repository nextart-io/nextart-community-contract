import { TextItem } from '../config/textContent';

interface Position {
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
}

interface TextElementProps {
  element: TextItem & {
    position: Position;
  };
}

export default function TextElement({ element }: TextElementProps) {
  const getFontClass = (language: string) => {
    switch (language) {
      case 'zh':
        return 'font-mashan text-black';
      case 'en':
        return element.style.fontFamily.includes('Permanent') 
          ? 'font-permanent text-black' 
          : 'font-caveat text-black';
      case 'jp':
        return 'font-notojp text-black';
      default:
        return 'text-black';
    }
  };

  return (
    <div
      className="absolute transition-all duration-500 hover:scale-110 cursor-pointer"
      style={{
        left: `${element.position.x}px`,
        top: `${element.position.y}px`,
        transform: `rotate(${element.position.rotation}deg) translate(-50%, -50%)`,
        whiteSpace: 'nowrap',
        opacity: 0.8,
        zIndex: 1,
      }}
    >
      <p
        className={getFontClass(element.language)}
        style={{
          fontSize: element.style.fontSize,
          fontWeight: element.style.fontWeight,
          fontFamily: element.style.fontFamily,
        }}
      >
        {element.text}
      </p>
    </div>
  );
}