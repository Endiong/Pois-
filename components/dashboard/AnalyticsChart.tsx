
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrophyIcon, ChartBarSquareIcon } from '../icons/Icons';

interface ChartData {
    date: string;
    score: number;
}

interface AnalyticsChartProps {
    theme: 'light' | 'dark';
    data: ChartData[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ theme, data }) => {
  const axisColor = theme === 'dark' ? '#9ca3af' : '#9ca3af';
  const gridColor = theme === 'dark' ? '#374151' : '#f3f4f6';
  const tooltipBg = theme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const tooltipBorder = theme === 'dark' ? '#374151' : '#e5e7eb';
  const textColor = theme === 'dark' ? '#fff' : '#111827';
  const subTextColor = theme === 'dark' ? '#9ca3af' : '#6b7280';

  // Calculate average score
  const avgScore = data.length > 0 
    ? Math.round(data.reduce((sum, item) => sum + item.score, 0) / data.length)
    : 0;

  // Determine trend (mock logic for demo if only 1 data point, otherwise real calc)
  const lastScore = data.length > 0 ? data[data.length - 1].score : 0;
  const isImproving = lastScore >= avgScore;

  return (
    <div className="bg-white dark:bg-gray-800 p-0 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 h-full overflow-hidden flex flex-col">
      <div className="p-6 pb-2">
          <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                   Weekly Score
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last 7 days performance</p>
            </div>
            <div className={`p-2 rounded-lg ${isImproving ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                <ChartBarSquareIcon className="w-5 h-5" />
            </div>
          </div>
          
          <div className="flex items-end gap-3 mb-2">
             <span className="text-4xl font-bold text-gray-900 dark:text-white">{avgScore}</span>
             <span className="text-sm text-gray-500 dark:text-gray-400 mb-1.5">avg. score</span>
          </div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
             {isImproving ? (
                 <span className="text-green-600 dark:text-green-400">↑ High performance</span>
             ) : (
                 <span className="text-orange-500 dark:text-orange-400">↓ Needs attention</span>
             )} today
          </div>
      </div>

      <div className="flex-1 w-full min-h-[180px] relative">
         {/* Gradient Overlay for style */}
         <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-800 to-transparent opacity-20 pointer-events-none z-10" />
         
         <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis 
                dataKey="date" 
                stroke={axisColor} 
                tick={{fontSize: 10, fill: subTextColor}} 
                tickLine={false}
                axisLine={false}
                padding={{ left: 20, right: 20 }}
            />
            {/* Hidden YAxis to keep chart clean but scaled */}
            <YAxis domain={[0, 100]} hide />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                padding: '8px 12px'
              }}
               labelStyle={{ color: subTextColor, fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
               itemStyle={{ color: textColor, fontWeight: 'bold', fontSize: '14px' }}
               formatter={(value: number) => [`${value}`, 'Score']}
               cursor={{ stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '4 4' }}
            />
            <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorScore)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#7c3aed' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;
