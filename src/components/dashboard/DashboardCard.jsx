// /app/components/dashboard/DashboardCard.js
export default function DashboardCard({ title, value, icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    red: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    teal: 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold mt-1 text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}