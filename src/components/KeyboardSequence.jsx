import React from 'react';

const KeyboardSequence = ({ sequence = [], activeIndex = 0, onKeyClick }) => {
  const keyboardLayout = [
    ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
    ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ', '{', 'Enter'],
    ['Left Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Right Shift', '↑'],
    ['Left Ctrl', 'Win', 'Left Alt', 'Space', 'Right Alt', 'Fn', 'Right Ctrl', '←', '↓', '→']
  ];

  const getKeyWidth = (key) => {
    const widths = {
      'Space': 'w-64',
      'Backspace': 'w-32',
      'Enter': 'w-28',
      'Left Shift': 'w-28',
      'Right Shift': 'w-28',
      'Tab': 'w-24',
      'Caps': 'w-24',
      '\\': 'w-16',
      'Left Ctrl': 'w-20',
      'Right Ctrl': 'w-20',
      'Left Alt': 'w-16',
      'Right Alt': 'w-16',
      'Win': 'w-14',
      'Fn': 'w-14',
      'Esc': 'w-16',
    };
    
    return widths[key] || (key.startsWith('F') ? 'w-14' : 'w-14');
  };

  const getSpecialKeyStatus = (key) => {
    const specialKeys = ['Left Ctrl', 'Right Ctrl', 'Left Alt', 'Right Alt', 'Left Shift', 'Right Shift'];
    if (!specialKeys.includes(key)) return false;
    
    return sequence.some(s => s.key === key);
  };

  const getKeyDisplay = (key) => {
    const displays = {
      'Left Ctrl': 'Ctrl',
      'Right Ctrl': 'Ctrl',
      'Left Alt': 'Alt',
      'Right Alt': 'Alt',
      'Left Shift': 'Shift',
      'Right Shift': 'Shift'
    };
    return displays[key] || key;
  };

  const getKeyStatus = (key) => {
    const isActive = sequence[activeIndex]?.key === key;
    const wasPressed = sequence.some(s => s.key === key && sequence.indexOf(s) < activeIndex);
    const isNext = sequence[activeIndex]?.key === key;
    
    return { isActive, wasPressed, isNext };
  };

  const renderKey = (key, rowIndex, keyIndex) => {
    const { isActive, wasPressed, isNext } = getKeyStatus(key);
    const displayText = getKeyDisplay(key);
    
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
          rounded-md
          font-medium
          text-sm
          transition-colors
          duration-150
          select-none
          focus:outline-none
          ${isActive 
            ? 'bg-blue-500 text-white scale-95 transform transition-transform' 
            : wasPressed 
              ? 'bg-blue-100 text-blue-700' 
              : isNext 
                ? 'bg-white text-gray-700 border-2 border-blue-500' 
                : 'bg-white text-gray-700 border border-gray-200'}
        `}
      >
        {displayText}
        {isNext && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping" />
        )}
      </button>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-4xl p-4">
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