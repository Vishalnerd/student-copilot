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
    <div className="flex min-h-[120px] sm:min-h-[140px] flex-col justify-between rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 p-4 sm:p-5 shadow-2xs transition-colors duration-200">
      <div className="flex items-start justify-between gap-3">
        {/* Icon */}
        <div className={`rounded-xl p-2 sm:p-2.5 ${iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>

        {/* Badge */}
        <span
          className={`rounded-full border px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold ${badgeColor}`}
        >
          {badge}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {label}
        </p>

        <p className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-slate-100 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

export default StatCard;
