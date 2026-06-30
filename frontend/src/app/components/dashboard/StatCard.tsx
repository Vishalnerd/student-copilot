"use client";

interface StatCardProps {
  icon: any;
  label: string;
  value: number;
  badge: string;
  badgeColor: string;
  iconBg: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
  badge,
  badgeColor,
  iconBg,
}: StatCardProps) {
  return (
    /* 💡 FIXED: Integrated white to slate dark-mode frame switches with transition anchors */
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-2xs flex flex-col justify-between min-h-[140px] transition-colors duration-200">
      <div className="flex items-start justify-between">
        {/* Dynamic arbitrary background block token */}
        <div className={`p-2.5 rounded-xl ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span
          className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}
        >
          {badge}
        </span>
      </div>

      <div className="mt-4">
        {/* 💡 FIXED: Inverted label details to stay legible on deep layers */}
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase font-mono tracking-wider">
          {label}
        </p>
        <p className="text-3xl font-black text-gray-900 dark:text-slate-100 mt-1 tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

export default StatCard;
