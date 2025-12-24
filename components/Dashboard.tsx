
import React from 'react';
import { Users, FileText, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Language, Translation, Employee } from '../types';

const data = [
  { name: 'Jan', employees: 40, cost: 2400 },
  { name: 'Feb', employees: 45, cost: 2600 },
  { name: 'Mar', employees: 50, cost: 2800 },
  { name: 'Apr', employees: 55, cost: 3000 },
  { name: 'May', employees: 58, cost: 3200 },
  { name: 'Jun', employees: 65, cost: 3500 },
];

interface DashboardProps {
  lang: Language;
  t: Translation;
  employees: Employee[];
}

const StatCard = ({ title, value, icon: Icon, trend, color, lang }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-1">
      {trend > 0 ? <TrendingUp size={16} className="text-emerald-500" /> : <TrendingDown size={16} className="text-rose-500" />}
      <span className={`text-sm font-bold ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
        {Math.abs(trend)}%
      </span>
      <span className="text-slate-400 text-xs">vs last month</span>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ lang, t, employees }) => {
  const totalPayroll = employees.reduce((acc, emp) => acc + emp.basicSalary + emp.allowances - emp.deductions, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{t.dashboard}</h1>
        <p className="text-slate-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title={t.totalEmployees} value={employees.length} icon={Users} trend={12} color="bg-indigo-600" lang={lang} />
        <StatCard title={t.pendingLeaves} value="14" icon={Calendar} trend={-5} color="bg-rose-500" lang={lang} />
        <StatCard title={t.activeContracts} value="92%" icon={FileText} trend={2} color="bg-amber-500" lang={lang} />
        <StatCard title={t.monthlyPayroll} value={`$${(totalPayroll / 1000).toFixed(1)}k`} icon={DollarSign} trend={8} color="bg-emerald-500" lang={lang} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Growth Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorEmp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="employees" stroke="#4f46e5" fillOpacity={1} fill="url(#colorEmp)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Payroll Expenditure</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="cost" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
