export default function DashboardOverview() {
  const chartData = [
    { month: 'Jan', requests: 2, completed: 1 },
    { month: 'Feb', requests: 4, completed: 3 },
    { month: 'Mar', requests: 3, completed: 2 },
    { month: 'Apr', requests: 5, completed: 4 },
    { month: 'May', requests: 6, completed: 5 },
    { month: 'Jun', requests: 8, completed: 6 },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-slate-900 dark:text-white">
          Request Overview
        </h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-slate-600 dark:text-slate-300">Requests</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-slate-600 dark:text-slate-300">Completed</span>
          </div>
        </div>
      </div>

      {/* Simple bar chart representation */}
      <div className="space-y-4">
        {chartData.map((data, index) => (
          <div key={data.month} className="flex items-center space-x-4">
            <div className="w-8 text-sm text-slate-600 dark:text-slate-300">
              {data.month}
            </div>
            <div className="flex-1 flex items-center space-x-2">
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-4 relative">
                <div
                  className="bg-blue-500 h-4 rounded-full"
                  style={{ width: `${(data.requests / 8) * 100}%` }}
                ></div>
                <div
                  className="bg-green-500 h-4 rounded-full absolute top-0"
                  style={{ width: `${(data.completed / 8) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 w-12">
                {data.completed}/{data.requests}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">85%</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Success Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">21</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Avg Days</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">247</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Companies</div>
          </div>
        </div>
      </div>
    </div>
  );
}
