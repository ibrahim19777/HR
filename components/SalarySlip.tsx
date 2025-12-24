
import React from 'react';
import { X, Printer, Download, ShieldCheck, CreditCard, Building2, User } from 'lucide-react';
import { Language, Translation, Employee } from '../types';

interface SalarySlipProps {
  lang: Language;
  t: Translation;
  employee: Employee;
  onClose: () => void;
}

const SalarySlip: React.FC<SalarySlipProps> = ({ lang, t, employee, onClose }) => {
  const currentMonth = new Date().toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' });
  
  const calculateAdjustmentValue = (basic: number, adj: any) => {
    switch (adj.type) {
      case 'Fixed': return adj.value;
      case 'Percentage': return (basic * adj.value) / 100;
      case 'Days': return (basic / 30) * adj.value;
      default: return 0;
    }
  };

  const bonuses = (employee.adjustments || []).filter(a => a.category === 'Bonus');
  const deductions = (employee.adjustments || []).filter(a => a.category === 'Deduction');
  
  const bonusTotal = bonuses.reduce((acc, a) => acc + calculateAdjustmentValue(employee.basicSalary, a), 0);
  const deductionTotal = (employee.deductions || 0) + deductions.reduce((acc, a) => acc + calculateAdjustmentValue(employee.basicSalary, a), 0);
  
  const grossSalary = employee.basicSalary + employee.allowances + bonusTotal;
  const netPayable = grossSalary - deductionTotal;

  const handleExportPDF = () => {
    const originalTitle = document.title;
    const name = lang === 'ar' ? employee.nameAr : employee.name;
    const safeName = name.replace(/\s+/g, '_');
    const monthYear = currentMonth.replace(/\s+/g, '_');
    
    // Set document title to influence the default filename in the print-to-pdf dialog
    document.title = `SalarySlip_${safeName}_${monthYear}`;
    
    window.print();
    
    // Restore original title
    setTimeout(() => {
      document.title = originalTitle;
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 relative my-8">
        {/* Header Controls */}
        <div className="absolute top-6 right-8 flex items-center gap-3 no-print z-10">
          <button 
            onClick={handleExportPDF}
            title={lang === 'ar' ? 'طباعة كشف الراتب' : 'Print Salary Slip'}
            className="p-3 bg-slate-50 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all border border-slate-100 hover:border-indigo-100 group"
          >
            <Printer size={20} className="group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={handleExportPDF}
            title={lang === 'ar' ? 'تصدير كـ PDF' : 'Export as PDF'}
            className="p-3 bg-slate-50 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all border border-slate-100 hover:border-indigo-100 group"
          >
            <Download size={20} className="group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={onClose} 
            className="p-3 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-2xl transition-all group"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <div className="p-12 print:p-0" id="printable-slip">
          {/* Company Branding */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                <ShieldCheck size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">MAWARD</h1>
                <p className="text-xs text-indigo-600 font-bold uppercase tracking-[0.2em]">{lang === 'ar' ? 'حلول الموارد البشرية السحابية' : 'Cloud HR Solutions'}</p>
              </div>
            </div>
            <div className="text-right rtl:text-left">
              <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-2">
                OFFICIAL PAYSLIP
              </span>
              <h2 className="text-3xl font-black text-slate-900">{t.salarySlip}</h2>
              <p className="text-slate-400 font-bold text-sm mt-1">{currentMonth}</p>
            </div>
          </div>

          {/* Employee & Company Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600"><User size={18} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t.name}</p>
                  <p className="font-bold text-slate-800 text-lg">{lang === 'ar' ? employee.nameAr : employee.name}</p>
                  <p className="text-xs text-slate-500 font-medium">{employee.employeeId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600"><Building2 size={18} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t.department}</p>
                  <p className="font-bold text-slate-800">{lang === 'ar' ? employee.departmentAr : employee.department}</p>
                  <p className="text-xs text-slate-500 font-medium">{lang === 'ar' ? employee.positionAr : employee.position}</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600"><CreditCard size={18} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t.paymentMethod}</p>
                  <p className="font-bold text-slate-800">{employee.paymentMethod === 'Bank' ? t.bank : t.cash}</p>
                  {employee.bankName && <p className="text-xs text-slate-500 font-medium">{employee.bankName} • {employee.accountNumber?.slice(-4).padStart(employee.accountNumber.length, '*')}</p>}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t.payPeriod}</p>
                <p className="font-bold text-slate-800">{currentMonth}</p>
                <p className="text-xs text-slate-500 font-medium">{lang === 'ar' ? 'تاريخ الاستحقاق' : 'Value Date'}: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Payroll Table */}
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            {/* Earnings Side */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-indigo-100 pb-2">
                <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest">{t.earnings}</h3>
                <span className="text-[10px] font-bold text-slate-400">{lang === 'ar' ? 'المبلغ' : 'Amount'}</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center group">
                  <span className="text-slate-600 text-sm font-medium">{t.basicSalary}</span>
                  <span className="font-bold text-slate-900 text-sm">${employee.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-slate-600 text-sm font-medium">{t.allowances}</span>
                  <span className="font-bold text-slate-900 text-sm">${employee.allowances.toLocaleString()}</span>
                </div>
                {bonuses.map(b => (
                  <div key={b.id} className="flex justify-between items-center group">
                    <span className="text-slate-600 text-sm font-medium">{b.reason}</span>
                    <span className="font-bold text-emerald-600 text-sm">+${calculateAdjustmentValue(employee.basicSalary, b).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center">
                <span className="text-sm font-black text-slate-900">{t.grossSalary}</span>
                <span className="text-lg font-black text-slate-900">${grossSalary.toLocaleString()}</span>
              </div>
            </div>

            {/* Deductions Side */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-rose-100 pb-2">
                <h3 className="text-sm font-black text-rose-600 uppercase tracking-widest">{t.deductions}</h3>
                <span className="text-[10px] font-bold text-slate-400">{lang === 'ar' ? 'الخصم' : 'Charge'}</span>
              </div>
              <div className="space-y-3">
                {employee.deductions > 0 && (
                  <div className="flex justify-between items-center group">
                    <span className="text-slate-600 text-sm font-medium">{employee.deductionReason || t.deductions}</span>
                    <span className="font-bold text-rose-600 text-sm">-${employee.deductions.toLocaleString()}</span>
                  </div>
                )}
                {deductions.map(d => (
                  <div key={d.id} className="flex justify-between items-center group">
                    <span className="text-slate-600 text-sm font-medium">{d.reason}</span>
                    <span className="font-bold text-rose-600 text-sm">-${calculateAdjustmentValue(employee.basicSalary, d).toLocaleString()}</span>
                  </div>
                ))}
                {employee.deductions === 0 && deductions.length === 0 && (
                  <p className="text-xs text-slate-400 italic py-4 text-center">No deductions for this period.</p>
                )}
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center">
                <span className="text-sm font-black text-slate-900">{t.totalDeductions}</span>
                <span className="text-lg font-black text-rose-600">-${deductionTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Final Net Calculation */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-indigo-900 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Building2 size={32} className="text-indigo-300" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-300 mb-1">{t.netPayable}</p>
                  <p className="text-5xl font-black tracking-tighter">${netPayable.toLocaleString()}</p>
                </div>
              </div>
              <div className="h-16 w-px bg-white/10 hidden md:block"></div>
              <div className="text-center md:text-right space-y-2">
                <p className="text-sm font-bold text-indigo-200">{lang === 'ar' ? 'إجمالي المبلغ كتابةً' : 'Total Amount in Words'}</p>
                <p className="text-xs opacity-60 font-medium italic">
                  {lang === 'ar' 
                    ? `فقط ${netPayable.toLocaleString()} دولار أمريكي لا غير` 
                    : `Only ${netPayable.toLocaleString()} US Dollars and zero cents.`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="mt-16 pt-8 border-t border-dashed border-slate-200 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Security Verification Code: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg mx-auto">
              This is a digitally generated document by Maward HRMS. It is verified and authenticated by the system. Any alterations to this document are strictly prohibited.
            </p>
            <div className="mt-8 flex items-center justify-center gap-2 grayscale opacity-50">
               <ShieldCheck size={20} className="text-indigo-600" />
               <p className="text-[10px] font-black text-slate-900 tracking-widest uppercase">Maward Certified Payroll</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; }
          #printable-slip { 
            padding: 40px !important; 
            width: 100% !important; 
            box-shadow: none !important;
          }
          .fixed { position: relative !important; inset: 0 !important; background: white !important; padding: 0 !important; }
          .bg-indigo-900 { background-color: #312e81 !important; color: white !important; -webkit-print-color-adjust: exact; }
          .rounded-[2.5rem] { border-radius: 0 !important; }
          .shadow-2xl, .shadow-xl { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

export default SalarySlip;
