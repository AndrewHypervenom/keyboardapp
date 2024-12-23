import React from 'react';

const Keyboard = ({ onKeySelect, selectedKeys = [] }) => {
  const keyboardLayout = {
    row1: [
      { key: 'Esc', width: 'w-16' },
      { key: 'F1' }, { key: 'F2' }, { key: 'F3' }, { key: 'F4' },
      { key: 'F5' }, { key: 'F6' }, { key: 'F7' }, { key: 'F8' },
      { key: 'F9' }, { key: 'F10' }, { key: 'F11' }, { key: 'F12' },
    ],
    row2: [
      { key: '`' }, { key: '1' }, { key: '2' }, { key: '3' }, { key: '4' },
      { key: '5' }, { key: '6' }, { key: '7' }, { key: '8' }, { key: '9' },
      { key: '0' }, { key: '-' }, { key: '=' }, { key: 'Backspace', width: 'w-20' }
    ],
    row3: [
      { key: 'Tab', width: 'w-16' }, { key: 'Q' }, { key: 'W' }, { key: 'E' },
      { key: 'R' }, { key: 'T' }, { key: 'Y' }, { key: 'U' }, { key: 'I' },
      { key: 'O' }, { key: 'P' }, { key: '[' }, { key: ']' }, { key: '\\', width: 'w-16' }
    ],
    row4: [
      { key: 'Caps', width: 'w-20' }, { key: 'A' }, { key: 'S' }, { key: 'D' },
      { key: 'F' }, { key: 'G' }, { key: 'H' }, { key: 'J' }, { key: 'K' },
      { key: 'L' }, { key: ';' }, { key: "'" }, { key: 'Enter', width: 'w-20' }
    ],
    row5: [
      { key: 'Left Shift', width: 'w-24', display: 'Shift' }, 
      { key: 'Z' }, { key: 'X' }, { key: 'C' }, { key: 'V' }, { key: 'B' }, 
      { key: 'N' }, { key: 'M' }, { key: ',' }, { key: '.' }, { key: '/' }, 
      { key: 'Right Shift', width: 'w-24', display: 'Shift' }
    ],
    row6: [
      { key: 'Left Ctrl', width: 'w-16', display: 'Ctrl' }, 
      { key: 'Fn', width: 'w-12' },
      { key: 'Win', width: 'w-12' }, 
      { key: 'Left Alt', width: 'w-12', display: 'Alt' },
      { key: 'Space', width: 'w-64' }, 
      { key: 'Right Alt', width: 'w-12', display: 'Alt' },
      { key: 'Right Ctrl', width: 'w-16', display: 'Ctrl' }
    ],
  };

  const KeyButton = ({ keyData }) => {
    const isSelected = selectedKeys.includes(keyData.key);
    return (
      <button
        onClick={() => onKeySelect(keyData.key)}
        className={`
          ${keyData.width || 'w-12'} h-12
          rounded-lg border-2 m-0.5
          transition-all duration-200
          font-medium text-sm
          ${isSelected 
            ? 'bg-primary-500 text-white border-primary-600 shadow-lg scale-105' 
            : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}
        `}
      >
        {keyData.display || keyData.key}
      </button>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <div className="space-y-2">
        <div className="flex gap-2 mb-4">
          {keyboardLayout.row1.map((k, i) => (
            <KeyButton key={i} keyData={k} />
          ))}
        </div>
        
        {Object.entries(keyboardLayout).slice(1).map(([rowName, keys], rowIndex) => (
          <div key={rowName} className="flex gap-0.5">
            {keys.map((k, i) => (
              <KeyButton key={i} keyData={k} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keyboard;