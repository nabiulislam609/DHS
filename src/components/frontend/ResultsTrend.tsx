import React from 'react';

export const ResultsTrend: React.FC = () => {
  const resultData = [
    { year: '2021', passRate: 95.0, aPlus: 28, gpa: 4.42 },
    { year: '2022', passRate: 96.5, aPlus: 32, gpa: 4.58 },
    { year: '2023', passRate: 97.8, aPlus: 38, gpa: 4.70 },
    { year: '2024', passRate: 98.7, aPlus: 42, gpa: 4.82 },
    { year: '2025', passRate: 99.1, aPlus: 45, gpa: 4.91 },
  ];

  return (
    <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full">
          একাডেমিক পারফরম্যান্স
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
          এসএসসি ফলাফলের ধারা
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          গত ৫ বছরের একাডেমিক পারফরম্যান্স এক নজরে
        </p>
      </div>

      {/* 2 Charts Grid matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Chart: পাশের হার ও A+ হার */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base text-gray-900">পাশের হার ও A+ হার</h3>
              <p className="text-xs text-gray-500">গত ৫ বছরে পাশের হার ও জিপিএ ৫</p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1 text-emerald-800">
                <span className="w-3 h-3 rounded bg-emerald-700 inline-block" />
                পাশের হার (%)
              </span>
              <span className="flex items-center gap-1 text-amber-600">
                <span className="w-3 h-3 rounded bg-amber-400 inline-block" />
                A+ (%)
              </span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-2 px-4 border-b border-gray-100 relative">
            {/* Horizontal guide lines */}
            <div className="absolute inset-x-0 top-8 border-b border-dashed border-gray-100" />
            <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-gray-100" />

            {resultData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="flex items-end gap-1.5 h-full w-full justify-center">
                  {/* Pass Rate Bar */}
                  <div
                    style={{ height: `${(d.passRate / 100) * 100}%` }}
                    className="w-5 sm:w-7 bg-emerald-700 rounded-t-sm transition-all duration-300 group-hover:bg-emerald-600 relative flex justify-center"
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-6 text-[10px] font-bold bg-gray-900 text-white px-1.5 py-0.5 rounded transition pointer-events-none">
                      {d.passRate}%
                    </span>
                  </div>

                  {/* A+ Bar */}
                  <div
                    style={{ height: `${(d.aPlus / 60) * 100}%` }}
                    className="w-4 sm:w-6 bg-amber-400 rounded-t-sm transition-all duration-300 group-hover:bg-amber-500 relative flex justify-center"
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-6 text-[10px] font-bold bg-gray-900 text-white px-1.5 py-0.5 rounded transition pointer-events-none">
                      {d.aPlus}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-600">{d.year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Chart: গড় জিপিএ ধারা */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base text-gray-900">গড় জিপিএ ধারা</h3>
              <p className="text-xs text-gray-500">গড় GPA — গত ৫ বছর</p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-2 text-xs font-medium text-rose-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span>গড় জিপিএ</span>
            </div>
          </div>

          {/* Line Chart with SVG */}
          <div className="h-64 relative flex flex-col justify-between pt-4 pb-2 px-2">
            <svg viewBox="0 0 500 220" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="30" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="30" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="30" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="30" y1="170" x2="480" y2="170" stroke="#f1f5f9" strokeDasharray="4 4" />

              {/* Y Axis Labels */}
              <text x="5" y="24" fontSize="10" fill="#94a3b8">5.00</text>
              <text x="5" y="74" fontSize="10" fill="#94a3b8">4.75</text>
              <text x="5" y="124" fontSize="10" fill="#94a3b8">4.50</text>
              <text x="5" y="174" fontSize="10" fill="#94a3b8">4.25</text>

              {/* Area Under Curve */}
              <path
                d="M 60 140 L 150 110 L 250 85 L 350 55 L 450 30 L 450 190 L 60 190 Z"
                fill="url(#gpaGradient)"
              />

              {/* Trend Line */}
              <path
                d="M 60 140 L 150 110 L 250 85 L 350 55 L 450 30"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Points */}
              {[
                { x: 60, y: 140, gpa: '4.42' },
                { x: 150, y: 110, gpa: '4.58' },
                { x: 250, y: 85, gpa: '4.70' },
                { x: 350, y: 55, gpa: '4.82' },
                { x: 450, y: 30, gpa: '4.91' },
              ].map((pt, idx) => (
                <g key={idx}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="bold"
                    fill="#1f2937"
                  >
                    {pt.gpa}
                  </text>
                </g>
              ))}

              {/* X Axis Years */}
              <text x="60" y="210" textAnchor="middle" fontSize="11" fill="#64748b">2021</text>
              <text x="150" y="210" textAnchor="middle" fontSize="11" fill="#64748b">2022</text>
              <text x="250" y="210" textAnchor="middle" fontSize="11" fill="#64748b">2023</text>
              <text x="350" y="210" textAnchor="middle" fontSize="11" fill="#64748b">2024</text>
              <text x="450" y="210" textAnchor="middle" fontSize="11" fill="#64748b">2025</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
