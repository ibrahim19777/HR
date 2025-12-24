
import React, { useState, useEffect } from 'react';
import { Language, Employee, LeaveRequest, EmployeeStatus } from './types';
import { TRANSLATIONS, MOCK_EMPLOYEES } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import AIAssistant from './components/AIAssistant';
import Payroll from './components/Payroll';
import AddEmployeeModal from './components/AddEmployeeModal';
import EmployeePortal from './components/EmployeePortal';
import LeaveManagement from './components/LeaveManagement';
import { Shield, User } from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [activePage, setActivePage] = useState('dashboard');
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'employee'>('admin');
  
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees([...employees, newEmp]);
  };

  const handleUpdateEmployee = (updatedEmp: Employee) => {
    setEmployees(employees.map(emp => emp.id === updatedEmp.id ? updatedEmp : emp));
  };

  const handleBulkStatusUpdate = (ids: Set<string>, newStatus: EmployeeStatus) => {
    setEmployees(employees.map(emp => ids.has(emp.id) ? { ...emp, status: newStatus } : emp));
  };

  const handleApplyLeave = (reqData: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>) => {
    const newReq: LeaveRequest = {
      ...reqData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    setLeaveRequests([newReq, ...leaveRequests]);
  };

  const handleLeaveAction = (id: string, status: 'Approved' | 'Rejected') => {
    setLeaveRequests(leaveRequests.map(r => r.id === id ? { ...r, status } : r));
    
    // If approved, update employee leave balance
    if (status === 'Approved') {
      const req = leaveRequests.find(r => r.id === id);
      if (req) {
        setEmployees(employees.map(emp => {
          if (emp.id === req.employeeId) {
            // Calculate days (simple difference)
            const start = new Date(req.startDate);
            const end = new Date(req.endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            return { ...emp, leaveBalance: Math.max(0, emp.leaveBalance - diffDays) };
          }
          return emp;
        }));
      }
    }
  };

  const renderContent = () => {
    if (userRole === 'employee') {
      return (
        <EmployeePortal 
          lang={lang} 
          t={t} 
          employee={employees[1]} 
          leaveRequests={leaveRequests}
          onApplyLeave={handleApplyLeave}
        />
      );
    }

    switch (activePage) {
      case 'dashboard':
        return <Dashboard lang={lang} t={t} employees={employees} />;
      case 'employees':
        return (
          <EmployeeList 
            lang={lang} 
            t={t} 
            employees={employees} 
            onAddClick={() => setIsAddModalOpen(true)} 
            onBulkStatusUpdate={handleBulkStatusUpdate}
          />
        );
      case 'ai':
        return <AIAssistant lang={lang} t={t} />;
      case 'payroll':
        return <Payroll lang={lang} t={t} employees={employees} onUpdateEmployee={handleUpdateEmployee} />;
      case 'attendance':
        return (
          <LeaveManagement 
            lang={lang} 
            t={t} 
            requests={leaveRequests.filter(r => r.status === 'Pending')}
            employees={employees}
            onAction={handleLeaveAction}
          />
        );
      case 'settings':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">{t.settings}</h2>
            <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
               <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">Compliance Country</p>
                    <p className="text-sm text-slate-500">Select which labor law system to apply</p>
                  </div>
                  <select className="bg-slate-100 border-none rounded-lg p-2 font-medium">
                    <option>{t.ksa}</option>
                    <option>{t.uae}</option>
                    <option>{t.egypt}</option>
                    <option>{t.qatar}</option>
                  </select>
               </div>
               <div className="pt-6 border-t border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4">Trial Information</h3>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <p className="text-amber-800 text-sm">You are on the <span className="font-bold">14-Day Free Trial</span>. Your access will expire in 11 days.</p>
                  </div>
               </div>
            </div>
          </div>
        );
      default:
        return <Dashboard lang={lang} t={t} employees={employees} />;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
      <Sidebar lang={lang} t={t} activePage={activePage} setActivePage={setActivePage} isEmployee={userRole === 'employee'} />
      
      <main className={`flex-1 ${lang === 'ar' ? 'mr-64' : 'ml-64'} min-h-screen transition-all duration-300`}>
        <Header lang={lang} t={t} setLang={setLang} />
        
        <div className="px-8 mt-4">
          <div className="inline-flex bg-slate-200 p-1 rounded-xl shadow-inner">
            <button 
              onClick={() => {setUserRole('admin'); setActivePage('dashboard');}}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${userRole === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              <Shield size={16} /> {t.adminPanel}
            </button>
            <button 
              onClick={() => setUserRole('employee')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${userRole === 'employee' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              <User size={16} /> {t.myPortal}
            </button>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto">
          {renderContent()}
        </div>
      </main>

      <AddEmployeeModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddEmployee}
        lang={lang}
        t={t}
      />
    </div>
  );
};

export default App;
