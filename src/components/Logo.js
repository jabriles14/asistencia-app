import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Icono SVG: Gota de agua + Circuito/Engranaje + Riego */}
      <svg
        className="w-12 h-12 text-blue-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Gota de agua */}
        <path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z" />
        {/* Elemento tecnológico (engranaje o circuito sutil) */}
        <circle cx="12" cy="10" r="2" fill="currentColor" className="text-green-500" />
        <path d="M12 10l-1.5 1.5M12 10l1.5 1.5M12 10l-1.5-1.5M12 10l1.5-1.5" stroke="currentColor" className="text-gray-400" />
        {/* Línea de riego (curva sutil) */}
        <path d="M6 18c3 0 6-4 6-4s3 4 6 4" className="text-blue-400" />
      </svg>
      {/* Texto del logo */}
      <span className="text-3xl font-bold text-gray-800">Calidad de Agua</span>
    </div>
  );
};

export default Logo;