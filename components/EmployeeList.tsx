
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Mail, Phone, CreditCard, Flag, Filter, CheckSquare, Square, Trash, Power, XCircle, Calendar, DollarSign, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Language, Translation, Employee, EmployeeStatus } from '../types';

interface EmployeeListProps {
  lang: Language;
  t: Translation;
  employees: Employee[];
  onAddClick: () => void;
  onBulkStatusUpdate: (ids: Set<string>, status: EmployeeStatus) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ lang, t, employees, onAddClick, onBulkStatusUpdate }) => {
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | 'All'>('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredEmployees = employees.filter((emp) => {
    if (statusFilter === 'All') return true;
    return emp.status === statusFilter;
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredEmployees.length && filteredEmployees.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredEmployees.map(emp => emp.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const getStatusColor = (status: EmployeeStatus) => {
    switch (status) {
      case EmployeeStatus.Active:
        return 'bg-emerald-100 text-emerald-700';
      case EmployeeStatus.OnLeave:
        return 'bg-amber-100 text-amber-700';
      case EmployeeStatus.Terminated:
        return 'bg-rose-100 text-rose-700';
      case EmployeeStatus.Inactive:
        return 'bg-slate-200 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const handleBulkAction = (status: EmployeeStatus) => {
    onBulkStatusUpdate(selectedIds, status);
    setSelectedIds(new Set());
  };

  return (
    <div className="p-8 relative min-h-[600px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.employees}</h1>
          <p className="text-slate-500 mt-1">Detailed directory of all company staff and their credentials.</p>
        </div>
        <button 
          onClick={onAddClick}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          {t.addEmployee}
        </button>
      </div>

      {/* Filters Section */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Filter size={16} className="text-slate-400" />
          <span className="text-sm font-bold text-slate-600 mr-2">Status:</span>
          <div className="flex gap-1">
            {(['All', ...Object.values(EmployeeStatus)] as const).map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setSelectedIds(new Set()); 
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-20">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-12 text-center">
                  <button 
                    onClick={toggleSelectAll}
                    className="text-indigo-600 hover:scale-110 transition-transform"
                  >
                    {selectedIds.size === filteredEmployees.length && filteredEmployees.length > 0 
                      ? <CheckSquare size={20} /> 
                      : <Square size={20} className="text-slate-300" />
                    }
                  </button>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.name}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.employeeId}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.nationalId}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.nationality}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.position}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.grossSalary}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.deductions}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.vacationDays}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.status}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">{t.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => {
                const isSelected = selectedIds.has(emp.id);
                const leavePercent = (emp.leaveBalance / (emp.totalLeaveEntitlement || 30)) * 100;
                const grossSalary = emp.basicSalary + emp.allowances;
                
                return (
                  <tr key={emp.id} className={`hover:bg-slate-50 transition-colors group ${isSelected ? 'bg-indigo-50/30' : ''}`}>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => toggleSelectRow(emp.id)}
                        className="text-indigo-600 hover:scale-110 transition-transform"
                      >
                        {isSelected 
                          ? <CheckSquare size={20} /> 
                          : <Square size={20} className="text-slate-300 group-hover:text-slate-400" />
                        }
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-100 flex-shrink-0">
                          {emp.profilePicture ? (
                            <img src={emp.profilePicture} alt={emp.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
                              {(lang === 'ar' ? emp.nameAr : emp.name).charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{lang === 'ar' ? emp.nameAr : emp.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                        {emp.employeeId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-600">
                        <CreditCard size={14} className="text-slate-400" />
                        <span className="text-sm font-mono">{emp.nationalId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Flag size={14} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">{lang === 'ar' ? emp.nationalityAr : emp.nationality}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Mail size={12} />
                          <span className="text-xs">{emp.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Phone size={12} />
                          <span className="text-xs font-medium">{emp.phoneNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-slate-800 font-bold text-sm">{lang === 'ar' ? emp.positionAr : emp.position}</p>
                      <p className="text-xs text-slate-400">{lang === 'ar' ? emp.departmentAr : emp.department}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-black">
                        <DollarSign size={14} />
                        <span>{grossSalary.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-rose-600 font-black">
                          <MinusCircleIcon size={14} />
                          <span>{emp.deductions.toLocaleString()}</span>
                        </div>
                        {emp.deductionReason && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium italic">
                            <AlertCircle size={10} />
                            <span>{emp.deductionReason}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap min-w-[140px]">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-indigo-600">
                            <Calendar size={12} />
                            <span className="text-xs font-black">{emp.leaveBalance}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">/ {emp.totalLeaveEntitlement || 30} {lang === 'ar' ? 'يوم' : 'Days'}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${leavePercent < 20 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                            style={{ width: `${leavePercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColor(emp.status)}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredEmployees.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-400">No employees found matching the current status filter.</p>
          </div>
        )}
      </div>

      {/* Floating Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className={`fixed bottom-8 ${lang === 'ar' ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'} z-30 animate-in slide-in-from-bottom duration-300 w-full max-w-2xl px-4`}>
          <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex flex-wrap items-center justify-between gap-4 border border-slate-800 backdrop-blur-md bg-opacity-95">
            <div className="flex items-center gap-4 border-r border-slate-700 pr-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-500/20">
                {selectedIds.size}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-indigo-400">Items</p>
                <p className="text-sm font-bold">Selected</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-1 justify-center">
              <button 
                onClick={() => handleBulkAction(EmployeeStatus.Active)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold text-xs transition-all border border-emerald-600/20"
              >
                <RefreshCw size={16} />
                Reactivate
              </button>
              <button 
                onClick={() => handleBulkAction(EmployeeStatus.Inactive)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-600/10 hover:bg-slate-500 text-slate-400 hover:text-white font-bold text-xs transition-all border border-slate-600/20"
              >
                <Power size={16} />
                Deactivate
              </button>
              <button 
                onClick={() => {
                  if(confirm(`Are you sure you want to terminate ${selectedIds.size} selected employees? This action will set their status to Terminated.`)) {
                    handleBulkAction(EmployeeStatus.Terminated);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white font-bold text-xs transition-all border border-rose-600/20"
              >
                <Trash size={16} />
                Terminate
              </button>
            </div>

            <button 
              onClick={() => setSelectedIds(new Set())}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              <XCircle size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Icon since lucide MinusCircle is usually used for removal, but here represents deduction
const MinusCircleIcon = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);

export default EmployeeList;
