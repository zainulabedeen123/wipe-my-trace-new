import { auth, currentUser } from "@clerk/nextjs/server";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentRequests from "@/components/dashboard/RecentRequests";
import StatsCards from "@/components/dashboard/StatsCards";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              Manage your privacy and track your data deletion requests
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Quick Actions */}
      <QuickActions />

      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardOverview />
        <RecentRequests />
      </div>
    </div>
  );
}
