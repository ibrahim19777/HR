
import React, { useState } from 'react';
import { Clock, Calendar, MapPin, Coffee, Send, History, DollarSign, PieChart, Plus, X, AlertCircle, FileText, Download, ChevronRight } from 'lucide-react';
import { Language, Translation, Employee, AttendanceRecord, LeaveRequest, LeaveType } from '../types';
import SalarySlip from './SalarySlip';

interface EmployeePortalProps {
  lang: Language;
  t: Translation;
  employee: Employee;
  leaveRequests: LeaveRequest[];
  onApplyLeave: (request: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>) => void;
}

const EmployeePortal: React.FC<EmployeePortalProps> = ({ lang, t, employee, leaveRequests, onApplyLeave }) => {
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [showSlip, setShowSlip] = useState(false);
  
  const [leaveFormData, setLeaveFormData] = useState({
    type: 'Annual' as LeaveType,
    startDate: '',
    endDate: '',
    reason: ''
  });

  const handleClockAction = (action: 'in' | 'out' | 'break_start' | 'break_end') => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition((pos) => {
      const time = new Date().toLocaleTimeString();
      const date = new Date().toLocaleDateString();
      
      if (action === 'in') {
        setAttendance({
          id: Math.random().toString(),
          employeeId: employee.id,
          date,
          clockIn: time,
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude }
        });
      } else if (attendance) {
        if (action === 'out') setAttendance({ ...attendance, clockOut: time });
        if (action === 'break_start') setAttendance({ ...attendance, breakStart: time });
        if (action === 'break_end') setAttendance({ ...attendance, breakEnd: time });
      }
      setLoading(false);
    }, () => setLoading(false));
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyLeave({
      employeeId: employee.id,
      ...leaveFormData
    });
    setIsLeaveModalOpen(false);
    setLeaveFormData({ type: 'Annual', startDate: '', endDate: '', reason: '' });
  };

  const myRequests = leaveRequests.filter(r => r.employeeId === employee.id);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700';
      case 'Rejected': return 'bg-rose-100 text-rose-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  const netSalary = (employee.basicSalary + employee.allowances - employee.deductions);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <img src={employee.profilePicture} className="w-24 h-24 rounded-full border-4 border-white/20 shadow-lg" alt={employee.name} />
          <div>
            <h1 className="text-3xl font-bold">{lang === 'ar' ? `مرحباً، ${employee.nameAr}` : `Welcome, ${employee.name}`}</h1>
            <p className="opacity-80 font-medium">{lang === 'ar' ? employee.positionAr : employee.position} • {employee.employeeId}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
          <div className="text-center">
            <p className="text-xs uppercase font-bold opacity-70 mb-1">{t.leaveBalance}</p>
            <p className="text-2xl font-black">{employee.leaveBalance} / {employee.totalLeaveEntitlement}</p>
          </div>
          <div className="w-px h-10 bg-white/20"></div>
          <div className="text-center">
            <p className="text-xs uppercase font-bold opacity-70 mb-1">{t.netSalary}</p>
            <p className="text-2xl font-black">${netSalary.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Attendance Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Clock className="text-indigo-600" />
                {t.attendance}
              </h2>
              <div className="text-slate-500 font-mono text-lg font-bold">
                {new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <button 
                disabled={!!attendance?.clockIn || loading}
                onClick={() => handleClockAction('in')}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-indigo-50 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 transition-all disabled:opacity-50 group"
              >
                <Clock className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold">{t.clockIn}</span>
                {attendance?.clockIn && <span className="mt-1 text-xs font-mono">{attendance.clockIn}</span>}
              </button>
              <button 
                disabled={!attendance?.clockIn || !!attendance?.clockOut || loading}
                onClick={() => handleClockAction('out')}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-rose-50 bg-rose-50/50 hover:bg-rose-50 text-rose-700 transition-all disabled:opacity-50 group"
              >
                <Send className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold">{t.clockOut}</span>
                {attendance?.clockOut && <span className="mt-1 text-xs font-mono">{attendance.clockOut}</span>}
              </button>
              <button 
                disabled={!attendance?.clockIn || !!attendance?.clockOut || !!attendance?.breakStart || loading}
                onClick={() => handleClockAction('break_start')}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-amber-50 bg-amber-50/50 hover:bg-amber-50 text-amber-700 transition-all disabled:opacity-50 group"
              >
                <Coffee className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold">{t.startBreak}</span>
                {attendance?.breakStart && <span className="mt-1 text-xs font-mono">{attendance.breakStart}</span>}
              </button>
              <button 
                disabled={!attendance?.breakStart || !!attendance?.breakEnd || loading}
                onClick={() => handleClockAction('break_end')}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-emerald-50 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 transition-all disabled:opacity-50 group"
              >
                <History className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold">{t.endBreak}</span>
                {attendance?.breakEnd && <span className="mt-1 text-xs font-mono">{attendance.breakEnd}</span>}
              </button>
            </div>
          </div>

          {/* Leaves History Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Calendar className="text-indigo-600" />
              My Time-Off Requests
            </h2>
            <div className="space-y-4">
              {myRequests.length === 0 ? (
                <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                  <p className="text-slate-400 font-bold">You haven't applied for any leave yet.</p>
                </div>
              ) : (
                myRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : req.status === 'Rejected' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{t[req.type.toLowerCase() as keyof Translation] || req.type}</p>
                        <p className="text-xs text-slate-500">{req.startDate} - {req.endDate}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusStyle(req.status)}`}>
                        {req.status}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Action Column */}
        <div className="space-y-8 h-fit">
          {/* Apply Leave Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
                <Plus size={32} />
              </div>
              <h2 className="text-xl font-bold">{t.applyLeave}</h2>
              <p className="text-slate-500 text-sm mt-1">Submit a new request for management approval.</p>
            </div>
            
            <button 
              onClick={() => setIsLeaveModalOpen(true)}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              <Calendar size={20} />
              New Request
            </button>
          </div>

          {/* Payroll View Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <DollarSign size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{lang === 'ar' ? 'كشف الراتب الأخير' : 'Latest Salary Slip'}</h3>
                <p className="text-xs text-slate-500 font-medium">{new Date().toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 mb-6">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.netPayable}</span>
                 <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">PAID</span>
               </div>
               <p className="text-3xl font-black text-slate-900">${netSalary.toLocaleString()}</p>
            </div>

            <button 
              onClick={() => setShowSlip(true)}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
            >
              <FileText size={20} />
              {lang === 'ar' ? 'عرض مفردات المرتب' : 'View Pay Slip'}
            </button>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
             <AlertCircle size={20} className="text-amber-600 shrink-0" />
             <p className="text-xs text-amber-800 font-medium">Please ensure you have enough leave balance before applying. Requests take up to 48 hours for review.</p>
          </div>
        </div>
      </div>

      {/* Leave Request Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-8 py-6 bg-indigo-600 text-white flex items-center justify-between">
              <h2 className="text-xl font-bold">{t.applyLeave}</h2>
              <button onClick={() => setIsLeaveModalOpen(false)} className="p-2 hover:bg-white/20 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleLeaveSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t.leaveType}</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={leaveFormData.type}
                  onChange={(e) => setLeaveFormData({...leaveFormData, type: e.target.value as LeaveType})}
                >
                  <option value="Annual">{t.annual}</option>
                  <option value="Sick">{t.sick}</option>
                  <option value="Emergency">{t.emergency}</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{t.startDate}</label>
                  <input 
                    required type="date" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" 
                    value={leaveFormData.startDate}
                    onChange={(e) => setLeaveFormData({...leaveFormData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{t.endDate}</label>
                  <input 
                    required type="date" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" 
                    value={leaveFormData.endDate}
                    onChange={(e) => setLeaveFormData({...leaveFormData, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t.reason}</label>
                <textarea 
                  required
                  rows={3} 
                  placeholder="Tell your manager why you need this time off..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  value={leaveFormData.reason}
                  onChange={(e) => setLeaveFormData({...leaveFormData, reason: e.target.value})}
                ></textarea>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSlip && (
        <SalarySlip 
          lang={lang}
          t={t}
          employee={employee}
          onClose={() => setShowSlip(false)}
        />
      )}
    </div>
  );
};

export default EmployeePortal;
