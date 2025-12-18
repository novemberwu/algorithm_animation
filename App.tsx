
import React, { useState, useRef, useEffect } from 'react';
import { ArrayItem, PartitionState } from './types';
import Pointer from './components/Pointer';

const INITIAL_DATA: string[] = ['B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'C', 'A', 'D', 'A', 'B', 'R', 'A'];

const App: React.FC = () => {
  const [items, setItems] = useState<ArrayItem[]>(
    INITIAL_DATA.map((val, idx) => ({ id: `item-${idx}-${val}`, value: val }))
  );
  const [indices, setIndices] = useState<PartitionState>({
    lt: 0,
    i: 1,
    gt: 14
  });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState(0);

  // Update box width for pointer alignment on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const firstBox = containerRef.current.children[0] as HTMLElement;
        if (firstBox) {
          setBoxWidth(firstBox.offsetWidth);
        }
      }
    };

    updateSize();
    // Add a small delay to ensure layout is settled for initial calculation
    const timer = setTimeout(updateSize, 100);
    
    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      clearTimeout(timer);
    };
  }, [items]);

  const handleBoxClick = (index: number) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      // Swap items
      const newItems = [...items];
      const temp = newItems[selectedIndex];
      newItems[selectedIndex] = newItems[index];
      newItems[index] = temp;
      setItems(newItems);
      setSelectedIndex(null);
    }
  };

  const incrementLtAndI = () => {
    setIndices(prev => ({
      ...prev,
      lt: Math.min(items.length - 1, prev.lt + 1),
      i: Math.min(items.length - 1, prev.i + 1)
    }));
  };

  const incrementI = () => {
    setIndices(prev => ({
      ...prev,
      i: Math.min(items.length - 1, prev.i + 1)
    }));
  };

  const decrementGt = () => {
    setIndices(prev => ({
      ...prev,
      gt: Math.max(0, prev.gt - 1)
    }));
  };

  const reset = () => {
    setItems(INITIAL_DATA.map((val, idx) => ({ id: `reset-${idx}-${val}-${Math.random()}`, value: val })));
    setIndices({ lt: 0, i: 1, gt: 14 });
    setSelectedIndex(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center overflow-x-hidden">
      <header className="text-center mb-8 max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">3-Way Partition Interactive Trace</h1>
        <p className="text-sm md:text-base text-slate-600 px-4">
          <span className="font-semibold text-indigo-600">Step 1:</span> Click two boxes to swap them.<br />
          <span className="font-semibold text-indigo-600">Step 2:</span> Advance pointers using the controls below.
        </p>
      </header>

      <main className="w-full max-w-6xl bg-white rounded-xl shadow-lg border border-slate-200 p-4 md:p-12">
        {/* Array Display */}
        <div className="relative mb-28 pt-8">
          <div 
            ref={containerRef}
            className="array-container flex flex-nowrap justify-center gap-1 sm:gap-2 items-center w-full px-2"
          >
            {items.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handleBoxClick(idx)}
                className={`
                  flex-1 min-w-0 max-w-[64px] aspect-square flex items-center justify-center 
                  border-2 rounded-md sm:rounded-lg cursor-pointer transition-all duration-200
                  text-xs sm:text-lg md:text-2xl font-bold code-font select-none
                  ${selectedIndex === idx 
                    ? 'bg-yellow-200 border-yellow-500 scale-105 z-10 shadow-md' 
                    : 'bg-slate-50 border-slate-300 hover:border-indigo-400 hover:bg-slate-100'}
                `}
              >
                {item.value}
                <div className="absolute -top-6 text-[10px] text-slate-400 font-normal">
                  {idx}
                </div>
              </div>
            ))}
          </div>

          {/* Pointers Row */}
          <div className="absolute left-0 right-0 h-16 pointer-events-none mt-2">
             <div className="relative w-full">
                <Pointer 
                  label="lt" 
                  index={indices.lt} 
                  color="bg-red-500" 
                  textColor="text-red-600"
                  boxWidth={boxWidth}
                />
                <Pointer 
                  label="i" 
                  index={indices.i} 
                  color="bg-blue-500" 
                  textColor="text-blue-600"
                  boxWidth={boxWidth}
                />
                <Pointer 
                  label="gt" 
                  index={indices.gt} 
                  color="bg-green-500" 
                  textColor="text-green-600"
                  boxWidth={boxWidth}
                />
             </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col items-center gap-6 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 w-full">
            <button
              onClick={incrementLtAndI}
              className="flex flex-col items-center justify-center p-3 md:p-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors group"
            >
              <span className="text-red-700 font-bold mb-1">lt++, i++</span>
              <span className="hidden md:inline text-xs text-red-500 group-hover:text-red-600 text-center">v &lt; pivot: swap(lt, i)</span>
            </button>
            <button
              onClick={incrementI}
              className="flex flex-col items-center justify-center p-3 md:p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors group"
            >
              <span className="text-blue-700 font-bold mb-1">i++</span>
              <span className="hidden md:inline text-xs text-blue-500 group-hover:text-blue-600 text-center">v == pivot: no swap</span>
            </button>
            <button
              onClick={decrementGt}
              className="flex flex-col items-center justify-center p-3 md:p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors group"
            >
              <span className="text-green-700 font-bold mb-1">gt--</span>
              <span className="hidden md:inline text-xs text-green-500 group-hover:text-green-600 text-center">v &gt; pivot: swap(i, gt)</span>
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={reset}
              className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-sm text-sm"
            >
              Reset Simulation
            </button>
          </div>
        </div>
      </main>

      <footer className="mt-8 mb-4 text-slate-500 text-xs md:text-sm max-w-3xl text-center space-y-4 px-4">
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
          <p className="font-semibold text-indigo-800 mb-1">Quick Logic Guide:</p>
          <ul className="text-left list-disc list-inside space-y-1">
            <li>Assume <strong className="text-indigo-900">pivot</strong> is 'B' (original items[0]).</li>
            <li>If <code className="code-font bg-indigo-100 px-1 rounded text-[11px]">v &lt; pivot</code>: swap(lt, i), lt++, i++</li>
            <li>If <code className="code-font bg-indigo-100 px-1 rounded text-[11px]">v &gt; pivot</code>: swap(i, gt), gt--</li>
            <li>If <code className="code-font bg-indigo-100 px-1 rounded text-[11px]">v == pivot</code>: i++</li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default App;
