// /app/components/dashboard/ActivityItem.js
export default function ActivityItem({ title, description, time, icon }) {
  return (
    <div className="flex items-start space-x-3 py-3 border-b dark:border-gray-700 last:border-0">
      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <div className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
        {time}
      </div>
    </div>
  );
}