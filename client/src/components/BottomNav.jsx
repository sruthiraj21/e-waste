import React from 'react';
import { Compass, ScanLine, Truck, Clock, BarChart3, Sparkles } from 'lucide-react';

export default function BottomNav({ activeTab, onNavigate }) {
  const tabs = [
    { id: 'home', label: 'Explore', icon: Compass },
    { id: 'scan', label: 'AI Scan', icon: ScanLine, highlight: true },
    { id: 'collectors', label: 'Collectors', icon: Truck },
    { id: 'dashboard', label: 'Activity', icon: Clock },
    { id: 'admin', label: 'Impact', icon: BarChart3 },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#F6FBF5]/95 backdrop-blur-md border-t border-[#1A1F1C]/10 px-4 py-2 flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        if (tab.highlight) {
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="flex flex-col items-center -top-3 relative group"
            >
              <div className="w-12 h-12 rounded-full bg-[#0F2D1F] text-[#10B981] flex items-center justify-center shadow-md ring-4 ring-[#F6FBF5] group-active:scale-95 transition-transform">
                <Sparkles className="w-5 h-5 text-[#10B981]" />
              </div>
              <span className="text-[10px] font-bold mt-1 text-[#0F2D1F]">{tab.label}</span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              isActive ? 'text-[#0F2D1F] font-bold' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <div className={`p-1 rounded-full ${isActive ? 'bg-[#D1FAE5]' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium tracking-tight mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
