
import React from 'react';
import AnalyticsChart from './AnalyticsChart';
import { PostureHistoryItem } from '../../types';
import { DownloadIcon, DocumentTextIcon, ChartBarSquareIcon, InfoCircleIcon } from '../icons/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ReportsViewProps {
  history: PostureHistoryItem[];
  theme: 'light' | 'dark';
}

const ReportsView: React.FC<ReportsViewProps> = ({ history, theme }) => {
  const chartData = history.length > 0 
    ? history.slice(0, 14).map(h => ({ date: new Date(h.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}), score: Math.round((h.goodDuration/h.duration)*100) })).reverse()
    : [
        { date: 'Jan 1', score: 65 }, { date: 'Jan 2', score: 70 }, { date: 'Jan 3', score: 68 }, 
        { date: 'Jan 4', score: 85 }, { date: 'Jan 5', score: 82 }, { date: 'Jan 6', score: 90 },
        { date: 'Jan 7', score: 88 }
    ];

  // Mock ergonomic data
  const ergonomicData = [
      { name: 'Head Tilt', value: 15, optimal: 10 },
      { name: 'Shoulder', value: 8, optimal: 5 },
      { name: 'Back Angle', value: 25, optimal: 20 },
  ];

  const handleDownloadReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "poise_report.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const gridColor = theme === 'dark' ? '#374151' : '#e0e0e0';
  const axisColor = theme === 'dark' ? '#9ca3af' : '#6b7280';

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h2>
           <p className="text-gray-500 mt-1">Deep dive into your posture analytics.</p>
        </div>
        <button 
            onClick={handleDownloadReport}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-orange-500/20 w-full sm:w-auto justify-center"
        >
            <DownloadIcon className="w-5 h-5" />
            Download Data
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 min-w-0">
           {/* Weekly Score Chart - Constrained Height */}
           <div className="h-[400px] w-full">
               <AnalyticsChart theme={theme} data={chartData} />
           </div>
           
           {/* Ergonomic Analysis */}
           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                 <ChartBarSquareIcon className="w-5 h-5 text-orange-500"/> Ergonomic Analysis
              </h3>
              <p className="text-sm text-gray-500 mb-6">Average deviation from neutral posture (degrees).</p>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ergonomicData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                        <XAxis type="number" stroke={axisColor} />
                        <YAxis dataKey="name" type="category" stroke={axisColor} width={80} tick={{fontSize: 12}} />
                        <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', borderColor: gridColor, borderRadius: '8px' }}
                        />
                        <Bar dataKey="value" name="Your Avg" barSize={24} radius={[0, 4, 4, 0]}>
                            {ergonomicData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.value > entry.optimal * 1.5 ? '#ef4444' : '#f97316'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex gap-3 text-sm text-blue-700 dark:text-blue-300">
                  <InfoCircleIcon className="w-5 h-5 flex-shrink-0" />
                  <p>Your head tilt averages <strong>15°</strong>, slightly above the optimal 10°. Try raising your monitor height.</p>
              </div>
           </div>
        </div>

        <div className="space-y-6 min-w-0">
            {/* Key Metrics */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Key Metrics</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-500">Total Sessions</span>
                        <span className="font-bold text-gray-900 dark:text-white">{history.length}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-500">Avg. Duration</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                           {history.length > 0 ? Math.round(history.reduce((a, b) => a + b.duration, 0) / history.length / 60) : 0} min
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                         <span className="text-sm text-gray-500">Best Day</span>
                         <span className="font-bold text-green-600">Wednesday</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                         <span className="text-sm text-gray-500">Overall Score</span>
                         <span className="font-bold text-orange-600">
                             {history.length > 0 ? Math.round(history.reduce((a,b) => a + (b.goodDuration/b.duration), 0)/history.length * 100) : 0}%
                         </span>
                    </div>
                </div>
            </div>

            {/* Monthly Summary */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                 <DocumentTextIcon className="w-5 h-5 text-gray-400"/> Monthly Summary
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                 Your average posture score this month is <strong>82%</strong>, which is a <strong>5% improvement</strong> from last month. 
                 You tend to slouch more in the late afternoons (3 PM - 5 PM). Consider taking a short walk or stretch break during these hours to reset your spine alignment.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
