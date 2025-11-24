
import React, { useState, useEffect } from 'react';

interface CalculatorButtonProps {
  text: string;
  color?: string;
  wide?: boolean;
  active?: boolean;
  onClick: () => void;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ 
  text, 
  color = 'bg-[#333333]', 
  wide = false, 
  onClick, 
  active = false 
}) => (
  <button
    onClick={onClick}
    className={`
      ${wide ? 'col-span-2 rounded-full px-6 text-left pl-7' : 'rounded-full h-14 w-14 flex items-center justify-center'} 
      ${active ? 'bg-white text-orange-500' : color} 
      ${color === 'bg-[#a5a5a5]' ? 'text-black' : 'text-white'}
      text-2xl font-normal active:opacity-70 transition-all duration-100 outline-none select-none
    `}
  >
    {text}
  </button>
);

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [fontSize, setFontSize] = useState('text-6xl');

  // Adjust font size based on display length
  useEffect(() => {
    const len = display.length;
    if (len > 9) setFontSize('text-3xl');
    else if (len > 7) setFontSize('text-4xl');
    else if (len > 6) setFontSize('text-5xl');
    else setFontSize('text-6xl');
  }, [display]);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    // Standard 'All Clear' behavior
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    const val = parseFloat(display);
    if (val === 0) return;
    setDisplay(String(val * -1));
  };

  const inputPercent = () => {
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      // If the user taps an operator, then changes their mind and taps another, just switch operator
      if (waitingForOperand) {
        setOperator(nextOperator);
        return;
      }
      
      const currentValue = prevValue || 0;
      const newValue = calculate(currentValue, inputValue, operator);
      
      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const handleEqual = () => {
    if (!operator || prevValue === null) return;
    
    const inputValue = parseFloat(display);
    const result = calculate(prevValue, inputValue, operator);
    
    setDisplay(String(result));
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const calculate = (prev: number, next: number, op: string) => {
    // Avoid floating point precision errors
    const p = prev;
    const n = next;
    
    switch (op) {
      case '÷': 
        if (n === 0) return 0; // Prevent Infinity
        return p / n;
      case '×': return p * n;
      case '-': return p - n;
      case '+': return p + n;
      default: return n;
    }
  };

  return (
    <div className="h-full w-full bg-black flex flex-col p-4 pb-5 select-none touch-manipulation">
      {/* Display */}
      <div className="flex-1 flex items-end justify-end px-2 pb-4 overflow-hidden">
        <div className={`text-white font-light truncate transition-all duration-100 ${fontSize}`}>
          {display}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-3">
        <CalculatorButton text={display !== '0' ? 'C' : 'AC'} color="bg-[#a5a5a5]" onClick={clear} />
        <CalculatorButton text="+/-" color="bg-[#a5a5a5]" onClick={toggleSign} />
        <CalculatorButton text="%" color="bg-[#a5a5a5]" onClick={inputPercent} />
        <CalculatorButton text="÷" color="bg-[#ff9f0a]" active={operator === '÷'} onClick={() => performOperation('÷')} />
        
        <CalculatorButton text="7" onClick={() => inputDigit('7')} />
        <CalculatorButton text="8" onClick={() => inputDigit('8')} />
        <CalculatorButton text="9" onClick={() => inputDigit('9')} />
        <CalculatorButton text="×" color="bg-[#ff9f0a]" active={operator === '×'} onClick={() => performOperation('×')} />
        
        <CalculatorButton text="4" onClick={() => inputDigit('4')} />
        <CalculatorButton text="5" onClick={() => inputDigit('5')} />
        <CalculatorButton text="6" onClick={() => inputDigit('6')} />
        <CalculatorButton text="-" color="bg-[#ff9f0a]" active={operator === '-'} onClick={() => performOperation('-')} />
        
        <CalculatorButton text="1" onClick={() => inputDigit('1')} />
        <CalculatorButton text="2" onClick={() => inputDigit('2')} />
        <CalculatorButton text="3" onClick={() => inputDigit('3')} />
        <CalculatorButton text="+" color="bg-[#ff9f0a]" active={operator === '+'} onClick={() => performOperation('+')} />
        
        <CalculatorButton text="0" wide onClick={() => inputDigit('0')} />
        <CalculatorButton text="." onClick={inputDot} />
        <CalculatorButton text="=" color="bg-[#ff9f0a]" onClick={handleEqual} />
      </div>
    </div>
  );
};
