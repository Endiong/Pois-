
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  unit: string;
  trend: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, unit, trend }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <div className="flex items-baseline">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-lg text-gray-600 ml-1">{unit}</p>
      </div>
      <p className={`text-sm mt-1 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{trend}</p>
    </div>
  );
};

export default StatsCard;
