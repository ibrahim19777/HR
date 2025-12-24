
import React, { useState } from 'react';
import { Download, Banknote, CreditCard, Search, PlusCircle, MinusCircle, Info, ChevronRight, Calculator, FileText, X, Save, ClipboardList } from 'lucide-react';
import { Language, Translation, PaymentMethod, Employee, PayrollAdjustment, AdjustmentCategory, AdjustmentValueType } from '../types';
import SalarySlip from './SalarySlip';
import PayrollReport from './PayrollReport';

interface PayrollProps {
  lang: Language;
  t: Translation;
  employees: Employee[];
  onUpdateEmployee: (updatedEmployee: Employee) => void;
}

const Payroll: React.FC<PayrollProps> = ({ lang, t, employees, onUpdateEmployee }) => {
  const [filter, setFilter] = useState<PaymentMethod | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null);
  const [selectedSlipEmployee, setSelectedSlipEmployee] = useState<Employee | null>(null);
  const [showFullReport, setShowFullReport] = useState(false);
  
  // Adjustment Modal State
  const [isAdjModalOpen, setIsAdjModalOpen] = useState(false);
  const [adjEmployee, setAdjEmployee] = useState<Employee | null>(null);
  const [adjData, setAdjData] = useState<Omit<PayrollAdjustment, 'id'>>({
    category: 'Deduction',
    type: 'Fixed',
    value: 0,
    reason: ''
  });

  const calculateAdjustmentValue = (basic: number, adj: PayrollAdjustment) => {
    switch (adj.type) {
      case 'Fixed': return adj.value;
      case 'Percentage': return (basic * adj.value) / 100;
      case 'Days': return (basic / 30) * adj.value;
      default: return 0;
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesFilter = filter === 'All' || emp.paymentMethod === filter;
    const matchesSearch = (lang === 'ar' ? emp.nameAr : emp.name).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTotals = (emp: Employee) => {
    const bonusTotal = (emp.adjustments || [])
      .filter(a => a.category === 'Bonus')
      .reduce((acc, a) => acc + calculateAdjustmentValue(emp.basicSalary, a), 0);
    
    const deductionTotal = (emp.deductions || 0) + (emp.adjustments || [])
      .filter(a => a.category === 'Deduction')
      .reduce((acc, a) => acc + calculateAdjustmentValue(emp.basicSalary, a), 0);

    const net = emp.basicSalary + emp.allowances + bonusTotal - deductionTotal;
    return { bonusTotal, deductionTotal, net };
  };

  const grandTotalNet = filteredEmployees.reduce((acc, emp) => acc + getTotals(emp).net, 0);

  const handleOpenAdjModal = (emp: Employee) => {
    setAdjEmployee(emp);
    setIsAdjModalOpen(true);
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjEmployee) return;

    const newAdjustment: PayrollAdjustment = {
      ...adjData,
      id: Math.random().toString(36).substr(2, 9)
    };

    const updatedEmployee: Employee = {
      ...adjEmployee,
      adjustments: [...(adjEmployee.adjustments || []), newAdjustment]
    };

    onUpdateEmployee(updatedEmployee);
    setIsAdjModalOpen(false);
    setAdjData({ category: 'Deduction', type: 'Fixed', value: 0, reason: '' });
  };

  const removeAdjustment = (emp: Employee, adjId: string) => {
    const updatedEmployee: Employee = {
      ...emp,
      adjustments: emp.adjustments.filter(a => a.id !== adjId)
    };
    onUpdateEmployee(updatedEmployee);
  };

  const handleExportCSV = () => {
    const headers = [
      lang === 'ar' ? 'الاسم' : 'Name',
      lang === 'ar' ? 'رقم الموظف' : 'Employee ID',
      lang === 'ar' ? 'الراتب الأساسي' : 'Basic Salary',
      lang === 'ar' ? 'البدلات' : 'Allowances',
      lang === 'ar' ? 'المكافآت' : 'Bonuses',
      lang === 'ar' ? 'الخصومات' : 'Deductions',
      lang === 'ar' ? 'صافي الراتب' : 'Net Salary'
    ];

    const rows = filteredEmployees.map(emp => {
      const { bonusTotal, deductionTotal, net } = getTotals(emp);
      return [
        lang === 'ar' ? emp.nameAr : emp.name,
        emp.employeeId,
        emp.basicSalary,
        emp.allowances,
        bonusTotal,
        deductionTotal,
        net
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `maward_payroll_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.payroll}</h1>
          <p className="text-slate-500 mt-1">Manage disbursements with advanced bonus and deduction rules.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFullReport(true)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
          >
            <ClipboardList size={20} />
            Generate Full Report
          </button>
          <button 
            onClick={handleExportCSV}
            className="bg-white text-slate-700 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download size={18} />
            {t.export}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-100 relative overflow-hidden">
          <Calculator className="absolute -right-4 -bottom-4 opacity-10" size={120} />
          <p className="opacity-80 text-sm font-medium">{t.netSalary} (Total)</p>
          <h3 className="text-3xl font-bold mt-1">${grandTotalNet.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <PlusCircle size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">{t.bonuses}</p>
            <h4 className="text-xl font-bold text-slate-800">
              ${filteredEmployees.reduce((acc, emp) => acc + getTotals(emp).bonusTotal, 0).toLocaleString()}
            </h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
            <MinusCircle size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">{t.deductions}</p>
            <h4 className="text-xl font-bold text-slate-800">
              ${filteredEmployees.reduce((acc, emp) => acc + getTotals(emp).deductionTotal, 0).toLocaleString()}
            </h4>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
          {(['All', 'Bank', 'Cash'] as const).map(p => (
            <button 
              key={p}
              onClick={() => setFilter(p)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${filter === p ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {p === 'All' ? 'All' : (p === 'Bank' ? t.bank : t.cash)}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-sm:max-w-none max-w-sm">
          <Search className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
          <input 
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2 ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-10"></th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.name}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.basicSalary}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.bonuses}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.deductions}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.netSalary}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">{t.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => {
                const { bonusTotal, deductionTotal, net } = getTotals(emp);
                const isExpanded = expandedEmployee === emp.id;
                
                return (
                  <React.Fragment key={emp.id}>
                    <tr className={`hover:bg-slate-50 transition-colors ${isExpanded ? 'bg-indigo-50/20' : ''}`}>
                      <td className="px-4 py-4">
                        <button onClick={() => setExpandedEmployee(isExpanded ? null : emp.id)} className={`p-1 hover:bg-slate-200 rounded-lg transition-transform ${isExpanded ? 'rotate-90 text-indigo-600' : 'text-slate-400'}`}>
                          <ChevronRight size={18} />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img src={emp.profilePicture} className="w-8 h-8 rounded-full border border-slate-200" alt={emp.name} />
                          <div>
                            <p className="font-bold text-slate-800">{lang === 'ar' ? emp.nameAr : emp.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">{emp.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">
                        ${emp.basicSalary.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-emerald-600 font-bold">
                        +${bonusTotal.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-rose-600 font-bold">
                        -${deductionTotal.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-indigo-600 font-black text-lg">${net.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                           <button 
                            onClick={() => setSelectedSlipEmployee(emp)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors group relative"
                            title={t.salarySlip}
                           >
                              <FileText size={18} />
                              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                {t.salarySlip}
                              </span>
                           </button>
                           <button 
                            onClick={() => handleOpenAdjModal(emp)}
                            className="text-indigo-600 hover:text-indigo-800 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                           >
                              {t.addAdjustment}
                           </button>
                        </div>
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="px-12 py-6 bg-slate-50/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Detailed Breakdown */}
                            <div className="space-y-4">
                              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.bonuses}</h4>
                              {emp.adjustments.filter(a => a.category === 'Bonus').length > 0 ? (
                                emp.adjustments.filter(a => a.category === 'Bonus').map(adj => (
                                  <div key={adj.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-100 shadow-sm group">
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><PlusCircle size={16}/></div>
                                      <div>
                                        <p className="text-sm font-bold text-slate-800">{adj.reason}</p>
                                        <p className="text-[10px] text-slate-400 italic">
                                          {adj.type === 'Percentage' ? `${adj.value}% of Basic` : (adj.type === 'Days' ? `${adj.value} Days Rate` : 'Fixed Amount')}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="font-black text-emerald-600 text-sm">+${calculateAdjustmentValue(emp.basicSalary, adj).toLocaleString()}</span>
                                      <button onClick={() => removeAdjustment(emp, adj.id)} className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                                        <X size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ))
                              ) : <p className="text-xs text-slate-400 italic">No bonuses recorded.</p>}
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.deductions}</h4>
                              {/* Legacy direct deduction display */}
                              {emp.deductions > 0 && (
                                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-rose-100 shadow-sm italic opacity-80">
                                   <div className="flex items-center gap-3">
                                      <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><MinusCircle size={16}/></div>
                                      <div>
                                        <p className="text-sm font-bold text-slate-800">{emp.deductionReason || t.deductions}</p>
                                        <p className="text-[10px] text-slate-400">Standard Deduction</p>
                                      </div>
                                   </div>
                                   <span className="font-black text-rose-600 text-sm">-${emp.deductions.toLocaleString()}</span>
                                </div>
                              )}
                              
                              {emp.adjustments.filter(a => a.category === 'Deduction').length > 0 ? (
                                emp.adjustments.filter(a => a.category === 'Deduction').map(adj => (
                                  <div key={adj.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-rose-100 shadow-sm group">
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><MinusCircle size={16}/></div>
                                      <div>
                                        <p className="text-sm font-bold text-slate-800">{adj.reason}</p>
                                        <p className="text-[10px] text-slate-400 italic">
                                          {adj.type === 'Percentage' ? `${adj.value}% of Basic` : (adj.type === 'Days' ? `${adj.value} Days Rate` : 'Fixed Amount')}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="font-black text-rose-600 text-sm">-${calculateAdjustmentValue(emp.basicSalary, adj).toLocaleString()}</span>
                                      <button onClick={() => removeAdjustment(emp, adj.id)} className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                                        <X size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ))
                              ) : (emp.deductions === 0 && <p className="text-xs text-slate-400 italic">No deductions recorded.</p>)}
                            </div>
                          </div>
                          
                          <div className="mt-6 flex items-center justify-between p-4 bg-indigo-900 rounded-2xl text-white shadow-lg">
                            <div className="flex items-center gap-3">
                               <Info size={20} className="text-indigo-300" />
                               <div>
                                  <p className="text-xs font-bold text-indigo-300 uppercase tracking-tighter">Net Pay Breakdown</p>
                                  <p className="text-sm opacity-80">Calculated for the current payroll cycle including all fixed and variable rules.</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-2xl font-black">${net.toLocaleString()}</p>
                               <p className="text-[10px] font-bold uppercase text-indigo-400 tracking-widest">Payable via {emp.paymentMethod}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjustment Modal */}
      {isAdjModalOpen && adjEmployee && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-8 py-6 bg-indigo-600 text-white flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{t.addAdjustment}</h2>
                <p className="text-xs opacity-80">{lang === 'ar' ? adjEmployee.nameAr : adjEmployee.name}</p>
              </div>
              <button onClick={() => setIsAdjModalOpen(false)} className="p-2 hover:bg-white/20 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveAdjustment} className="p-8 space-y-5">
              <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
                 {(['Bonus', 'Deduction'] as const).map(cat => (
                   <button 
                    key={cat}
                    type="button"
                    onClick={() => setAdjData({...adjData, category: cat})}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${adjData.category === cat ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                   >
                     {cat === 'Bonus' ? t.bonuses : t.deductions}
                   </button>
                 ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t.reason}</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Performance Bonus, Late Penalty"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={adjData.reason}
                  onChange={(e) => setAdjData({...adjData, reason: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{t.type}</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={adjData.type}
                    onChange={(e) => setAdjData({...adjData, type: e.target.value as AdjustmentValueType})}
                  >
                    <option value="Fixed">{t.fixedAmount}</option>
                    <option value="Percentage">{t.percentage}</option>
                    <option value="Days">{t.days}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{t.value}</label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={adjData.value}
                    onChange={(e) => setAdjData({...adjData, value: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-2xl flex items-center gap-3">
                 <Info size={18} className="text-indigo-600" />
                 <p className="text-[10px] text-indigo-800 font-bold leading-tight">
                   {adjData.category === 'Deduction' 
                    ? "Adding a deduction will reduce the net salary. You can add multiple reasons." 
                    : "Adding a bonus will increase the net salary."}
                 </p>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2">
                  <Save size={18} />
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedSlipEmployee && (
        <SalarySlip 
          lang={lang}
          t={t}
          employee={selectedSlipEmployee}
          onClose={() => setSelectedSlipEmployee(null)}
        />
      )}

      {showFullReport && (
        <PayrollReport 
          lang={lang}
          t={t}
          employees={filteredEmployees}
          onClose={() => setShowFullReport(false)}
        />
      )}
    </div>
  );
};

export default Payroll;
