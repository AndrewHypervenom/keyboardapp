import React, { useCallback, useEffect } from 'react';

const KeyboardSequence = ({ sequence = [], activeIndex = 0, onKeyClick }) => {
  const keyboardLayout = [
    ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Borrar'],
    ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
    ['Bloq', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ', '{', 'Enter'],
    ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift', '↑'],
    ['Ctrl', 'Win', 'Alt', 'Espacio', 'Alt', 'Fn', 'Ctrl', '←', '↓', '→']
  ];

  const handleKeyPress = useCallback((event) => {
    const key = event.key.toUpperCase();
    if (sequence.some(s => s.key.toUpperCase() === key)) {
      onKeyClick(key);
    }
  }, [sequence, onKeyClick]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const getKeyWidth = (key) => {
    const widths = {
      'Espacio': 'w-1/3',
      'Borrar': 'w-32',
      'Enter': 'w-28',
      'Shift': 'w-28',
      'Tab': 'w-24',
      'Bloq': 'w-24',
      '\\': 'w-16',
      'Ctrl': 'w-16',
      'Alt': 'w-14',
      'Win': 'w-14',
      'Fn': 'w-14',
      'Esc': 'w-16',
    };
    
    return widths[key] || (key.startsWith('F') ? 'w-14' : 'w-14');
  };

  const getKeyStatus = (key) => {
    const isActive = sequence[activeIndex]?.key === key;
    const wasPressed = sequence.some(s => s.key === key && sequence.indexOf(s) < activeIndex);
    const isNext = sequence[activeIndex]?.key === key;
    
    return { isActive, wasPressed, isNext };
  };

  const renderKey = (key, rowIndex, keyIndex) => {
    const { isActive, wasPressed, isNext } = getKeyStatus(key);
    
    return (
      <button
        key={`${rowIndex}-${keyIndex}`}
        onClick={() => onKeyClick(key)}
        className={`
          ${getKeyWidth(key)}
          h-12
          m-0.5
          flex
          items-center
          justify-center
          rounded-lg
          font-medium
          text-sm
          transition-all
          duration-300
          ease-out
          select-none
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:ring-opacity-50
          ${isActive ? 'bg-blue-500 text-white transform scale-95 shadow-inner' : 
            wasPressed ? 'bg-blue-50 text-blue-700 transform scale-100' :
            isNext ? 'bg-white text-gray-700 border-2 border-blue-500' :
            'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 active:bg-gray-100'}
          ${isActive ? 'animate-pulse' : ''}
          shadow-sm
          hover:shadow-md
        `}
        aria-pressed={isActive || wasPressed}
        aria-label={`Tecla ${key}`}
        role="button"
        tabIndex={0}
      >
        {key}
        {isNext && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-ping" />
        )}
      </button>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-5xl bg-white rounded-xl p-8 shadow-xl">
        <div className="space-y-1">
          {keyboardLayout.map((row, rowIndex) => (
            <div 
              key={rowIndex} 
              className="flex justify-start items-center gap-0.5"
            >
              {row.map((key, keyIndex) => renderKey(key, rowIndex, keyIndex))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeyboardSequence;