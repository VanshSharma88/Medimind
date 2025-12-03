import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { TrendingUp, AlertTriangle, IndianRupee, Package, RefreshCw } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
  <div className="bg-card p-6 rounded-xl border border-gray-800">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-2 text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon size={24} className={color.replace("bg-", "text-")} />
      </div>
    </div>
    {subtext && <p className="text-sm text-gray-400 mt-4">{subtext}</p>}
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalMedicines: 0,
    lowStock: 0,
    nearExpiry: 0,
    recentSales: [],
  });
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // Add timestamp to prevent caching
      const res = await axios.get(`http://localhost:4000/api/dashboard/stats?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [location.key]); // Re-fetch when location key changes (navigation)

  // Process data for chart
  const chartData = stats.recentSales.reduce((acc, sale) => {
    const date = new Date(sale.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const existing = acc.find((item) => item.date === date);
    if (existing) {
      existing.amount += sale.total;
    } else {
      acc.push({ date, amount: sale.total });
    }
    return acc;
  }, []).slice(-7); // Ensure we only show last 7 days if not already filtered

  if (loading) return <div className="text-center p-10">Loading Dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <button
          onClick={fetchStats}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/sales" className="block transition-transform hover:scale-105">
          <StatCard
            title="Total Sales"
            value={`₹${stats.totalSales.toLocaleString()}`}
            icon={IndianRupee}
            color="bg-green-500"
            subtext="+2.5% from yesterday"
          />
        </Link>
        <Link to="/inventory" className="block transition-transform hover:scale-105">
          <StatCard
            title="Total Inventory"
            value={stats.totalMedicines}
            icon={Package}
            color="bg-blue-500"
            subtext="Active medicines"
          />
        </Link>
        <Link to="/inventory" state={{ filter: "lowStock" }} className="block transition-transform hover:scale-105">
          <StatCard
            title="Low Stock Alerts"
            value={stats.lowStock}
            icon={AlertTriangle}
            color="bg-yellow-500"
            subtext="Medicines below 10 units"
          />
        </Link>
        <Link to="/inventory" state={{ filter: "nearExpiry" }} className="block transition-transform hover:scale-105">
          <StatCard
            title="Near Expiry"
            value={stats.nearExpiry}
            icon={AlertTriangle}
            color="bg-red-500"
            subtext="Expires in < 30 days"
          />
        </Link>
      </div>

      {/* Recent Sales & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-bold mb-4">Sales Trends</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tick={{ fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", color: "#F3F4F6" }}
                  itemStyle={{ color: "#10B981" }}
                  formatter={(value) => [`₹${value}`, "Sales"]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-bold mb-4">Recent Sales</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-sm">
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.recentSales.length > 0 ? (
                  stats.recentSales.map((sale) => (
                    <tr key={sale.id} className="border-b border-gray-800/50">
                      <td className="py-3">#{sale.id}</td>
                      <td className="py-3">{new Date(sale.date).toLocaleDateString()}</td>
                      <td className="py-3 text-right text-green-400 font-medium">
                        ₹{sale.total.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-500">
                      No recent sales found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
