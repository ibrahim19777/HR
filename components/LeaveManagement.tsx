
import React from 'react';
import { CheckCircle, XCircle, Clock, Calendar, User } from 'lucide-react';
import { Language, Translation, LeaveRequest, Employee } from '../types';

interface LeaveManagementProps {
  lang: Language;
  t: Translation;
  requests: LeaveRequest[];
  employees: Employee[];
  onAction: (id: string, status: 'Approved' | 'Rejected') => void;
}

const LeaveManagement: React.FC<LeaveManagementProps> = ({ lang, t, requests, employees, onAction }) => {
  const getEmployee = (id: string) => employees.find(e => e.id === id);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{t.pendingLeaves}</h1>
        <p className="text-slate-500 mt-1">Review and manage time-off requests from your team.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {requests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-20 text-center">
            <Calendar size={64} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold">No pending leave requests at the moment.</p>
          </div>
        ) : (
          requests.map((req) => {
            const emp = getEmployee(req.employeeId);
            return (
              <div key={req.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full border-2 border-indigo-50 overflow-hidden bg-slate-100 flex-shrink-0">
                    {emp?.profilePicture ? (
                      <img src={emp.profilePicture} alt={emp.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
                        <User />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{lang === 'ar' ? emp?.nameAr : emp?.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-slate-500 text-sm">
                      <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg font-bold">
                        {t[req.type.toLowerCase() as keyof Translation] || req.type}
                      </span>
                      <span>{req.startDate} → {req.endDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 max-w-md">
                   <p className="text-slate-600 text-sm italic line-clamp-2">"{req.reason}"</p>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => onAction(req.id, 'Approved')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-bold hover:bg-emerald-100 transition-colors"
                  >
                    <CheckCircle size={18} />
                    {t.approve}
                  </button>
                  <button 
                    onClick={() => onAction(req.id, 'Rejected')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-700 rounded-xl font-bold hover:bg-rose-100 transition-colors"
                  >
                    <XCircle size={18} />
                    {t.reject}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LeaveManagement;
