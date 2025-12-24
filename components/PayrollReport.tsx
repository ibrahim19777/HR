
import React from 'react';
import { X, Printer, Download, ShieldCheck, FileText, Calendar, PieChart } from 'lucide-react';
import { Language, Translation, Employee } from '../types';

interface PayrollReportProps {
  lang: Language;
  t: Translation;
  employees: Employee[];
  onClose: () => void;
}

const PayrollReport: React.FC<PayrollReportProps> = ({ lang, t, employees, onClose }) => {
  const currentMonth = new Date().toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' });

  const calculateAdjustmentValue = (basic: number, adj: any) => {
    switch (adj.type) {
      case 'Fixed': return adj.value;
      case 'Percentage': return (basic * adj.value) / 100;
      case 'Days': return (basic / 30) * adj.value;
      default: return 0;
    }
  };

  const getEmpTotals = (emp: Employee) => {
    const bonusTotal = (emp.adjustments || [])
      .filter(a => a.category === 'Bonus')
      .reduce((acc, a) => acc + calculateAdjustmentValue(emp.basicSalary, a), 0);
    
    const deductionTotal = (emp.deductions || 0) + (emp.adjustments || [])
      .filter(a => a.category === 'Deduction')
      .reduce((acc, a) => acc + calculateAdjustmentValue(emp.basicSalary, a), 0);

    const gross = emp.basicSalary + emp.allowances + bonusTotal;
    const net = gross - deductionTotal;
    return { bonusTotal, deductionTotal, gross, net };
  };

  const totals = employees.reduce((acc, emp) => {
    const { bonusTotal, deductionTotal, gross, net } = getEmpTotals(emp);
    return {
      basic: acc.basic + emp.basicSalary,
      allowances: acc.allowances + emp.allowances,
      bonuses: acc.bonuses + bonusTotal,
      deductions: acc.deductions + deductionTotal,
      gross: acc.gross + gross,
      net: acc.net + net
    };
  }, { basic: 0, allowances: 0, bonuses: 0, deductions: 0, gross: 0, net: 0 });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 relative my-8">
        {/* Header Controls */}
        <div className="absolute top-6 right-8 flex items-center gap-3 no-print z-10">
          <button 
            onClick={() => window.print()}
            className="p-3 bg-slate-50 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all border border-slate-100 hover:border-indigo-100 group"
          >
            <Printer size={20} className="group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={onClose} 
            className="p-3 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-2xl transition-all group"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <div className="p-12 print:p-0" id="printable-report">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                <ShieldCheck size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">MAWARD HR</h1>
                <p className="text-xs text-indigo-600 font-bold uppercase tracking-[0.2em]">{lang === 'ar' ? 'تقرير الرواتب التفصيلي' : 'Detailed Payroll Report'}</p>
              </div>
            </div>
            <div className="text-right rtl:text-left">
              <div className="flex items-center justify-end gap-2 text-indigo-600 mb-1">
                <Calendar size={16} />
                <span className="text-sm font-black uppercase tracking-widest">{currentMonth}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">{lang === 'ar' ? 'ملخص رواتب الفريق' : 'Team Payroll Summary'}</h2>
              <p className="text-slate-400 font-bold text-xs mt-1">Generated on {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Quick Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{lang === 'ar' ? 'إجمالي الأساسي' : 'Total Basic'}</p>
                <p className="text-xl font-black text-slate-800">${totals.basic.toLocaleString()}</p>
             </div>
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{lang === 'ar' ? 'إجمالي البدلات' : 'Total Allowances'}</p>
                <p className="text-xl font-black text-slate-800">${totals.allowances.toLocaleString()}</p>
             </div>
             <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{lang === 'ar' ? 'إجمالي المكافآت' : 'Total Bonuses'}</p>
                <p className="text-xl font-black text-emerald-700">+${totals.bonuses.toLocaleString()}</p>
             </div>
             <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 text-center">
                <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">{lang === 'ar' ? 'إجمالي الخصومات' : 'Total Deductions'}</p>
                <p className="text-xl font-black text-rose-700">-${totals.deductions.toLocaleString()}</p>
             </div>
          </div>

          {/* Detailed Table */}
          <div className="border border-slate-200 rounded-3xl overflow-hidden mb-12">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-4 py-4 font-black uppercase tracking-tighter">{t.name}</th>
                  <th className="px-4 py-4 font-black uppercase tracking-tighter">{t.employeeId}</th>
                  <th className="px-4 py-4 font-black uppercase tracking-tighter">{t.basicSalary}</th>
                  <th className="px-4 py-4 font-black uppercase tracking-tighter">{t.allowances}</th>
                  <th className="px-4 py-4 font-black uppercase tracking-tighter">{t.bonuses}</th>
                  <th className="px-4 py-4 font-black uppercase tracking-tighter">{t.deductions}</th>
                  <th className="px-4 py-4 font-black uppercase tracking-tighter text-right">{t.netSalary}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map(emp => {
                  const { bonusTotal, deductionTotal, net } = getEmpTotals(emp);
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 font-bold text-slate-800">{lang === 'ar' ? emp.nameAr : emp.name}</td>
                      <td className="px-4 py-4 font-mono text-slate-500">{emp.employeeId}</td>
                      <td className="px-4 py-4 text-slate-600">${emp.basicSalary.toLocaleString()}</td>
                      <td className="px-4 py-4 text-slate-600">${emp.allowances.toLocaleString()}</td>
                      <td className="px-4 py-4 text-emerald-600 font-bold">+{bonusTotal.toLocaleString()}</td>
                      <td className="px-4 py-4 text-rose-600 font-bold">-{deductionTotal.toLocaleString()}</td>
                      <td className="px-4 py-4 text-indigo-600 font-black text-right">${net.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                <tr>
                  <td colSpan={2} className="px-4 py-5 font-black text-slate-900 uppercase tracking-widest text-center">Grand Totals</td>
                  <td className="px-4 py-5 font-black text-slate-800">${totals.basic.toLocaleString()}</td>
                  <td className="px-4 py-5 font-black text-slate-800">${totals.allowances.toLocaleString()}</td>
                  <td className="px-4 py-5 font-black text-emerald-600">+${totals.bonuses.toLocaleString()}</td>
                  <td className="px-4 py-5 font-black text-rose-600">-${totals.deductions.toLocaleString()}</td>
                  <td className="px-4 py-5 font-black text-indigo-600 text-right text-lg">${totals.net.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-slate-100">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-900 text-white rounded-2xl shadow-lg">
                  <PieChart size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Report Status</p>
                  <p className="text-sm font-bold text-slate-800">Finalized & Certified</p>
                </div>
             </div>

             <div className="flex gap-12 text-center">
                <div className="space-y-4">
                  <div className="w-32 h-px bg-slate-300"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prepared By</p>
                </div>
                <div className="space-y-4">
                  <div className="w-32 h-px bg-slate-300"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized By</p>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; }
          #printable-report { 
            padding: 20px !important; 
            width: 100% !important; 
            box-shadow: none !important;
          }
          .fixed { position: relative !important; inset: 0 !important; background: white !important; padding: 0 !important; }
          .bg-slate-900 { background-color: #0f172a !important; color: white !important; -webkit-print-color-adjust: exact; }
          .bg-slate-50 { background-color: #f8fafc !important; -webkit-print-color-adjust: exact; }
          .bg-indigo-900 { background-color: #312e81 !important; color: white !important; -webkit-print-color-adjust: exact; }
          .rounded-[2.5rem] { border-radius: 0 !important; }
          .shadow-2xl, .shadow-xl { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

export default PayrollReport;
