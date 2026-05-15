import React from 'react';

export default function BarBrown() {
  return (
    <div className="bg-[#4b1c09] text-white text-sm">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span>(11) 2636-1112</span>
            <span className="text-gray-500">|</span>
            <span>vendas@vtcouro.com.br</span>
          </div>
        </div>
        <p className="text-[#d4a574] font-medium tracking-widest">
          Couro genuíno · feito sob medida
        </p>
      </div>
    </div>
  );
}
