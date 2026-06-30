"use client";

export default function FlashcardSkeleton() {
  return (
    <div className="max-w-xl mx-auto space-y-8 animate-pulse">
      {/* Progress tracking wrapper element block placeholder */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded-md w-28" />
          <div className="h-3 bg-gray-200 rounded-md w-14" />
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full" />
      </div>

      {/* Main card template placeholder */}
      <div className="space-y-4">
        <div className="w-full h-64 bg-white border border-gray-200 rounded-2xl p-8 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-2 bg-gray-200 rounded-md w-16" />
            <div className="h-5 bg-gray-200 rounded-md w-5/6" />
            <div className="h-5 bg-gray-200 rounded-md w-2/3" />
          </div>
          <div className="h-3 bg-gray-100 rounded-md w-24 self-center" />
        </div>

        {/* Lower interactive button panel indicators */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-9 bg-gray-200 rounded-xl w-32" />
          <div className="h-9 bg-gray-200 rounded-xl w-32" />
        </div>
      </div>
    </div>
  );
}
