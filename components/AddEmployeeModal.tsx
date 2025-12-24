
import React, { useState, useRef } from 'react';
import { X, UserPlus, Save, Camera, Upload } from 'lucide-react';
import { Language, Translation, Employee, EmployeeStatus, PaymentMethod } from '../types';
import { MOCK_DEPARTMENTS, MOCK_EMPLOYEES } from '../constants';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (employee: Employee) => void;
  lang: Language;
  t: Translation;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onAdd, lang, t }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    email: '',
    phoneNumber: '',
    nationalId: '',
    nationality: '',
    nationalityAr: '',
    position: '',
    positionAr: '',
    departmentId: '',
    basicSalary: 0,
    allowances: 0,
    paymentMethod: 'Bank' as PaymentMethod,
    totalLeaveEntitlement: 30,
    managerId: ''
  });

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = MOCK_DEPARTMENTS.find(d => d.id === formData.departmentId);
    
    const newEmployee: Employee = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      department: dept?.name || '',
      departmentAr: dept?.nameAr || '',
      profilePicture: profilePreview || `https://i.pravatar.cc/150?u=${Math.random()}`,
      deductions: 0,
      adjustments: [],
      joinDate: new Date().toISOString().split('T')[0],
      status: EmployeeStatus.Active,
      leaveBalance: formData.totalLeaveEntitlement,
    };
    onAdd(newEmployee);
    onClose();
    setProfilePreview(null);
    setFormData({
      name: '', nameAr: '', email: '', phoneNumber: '', nationalId: '',
      nationality: '', nationalityAr: '', position: '', positionAr: '',
      departmentId: '', basicSalary: 0, allowances: 0, paymentMethod: 'Bank',
      totalLeaveEntitlement: 30, managerId: ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 bg-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserPlus size={24} />
            <h2 className="text-xl font-bold">{t.addEmployee}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[85vh]">
          <div className="flex flex-col items-center mb-8">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-32 h-32 rounded-full border-4 border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center relative shadow-inner">
                {profilePreview ? (
                  <img src={profilePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={40} className="text-slate-300" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload size={24} className="text-white" />
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              <p className="mt-2 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.profilePicture}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Full Name (EN)</label>
              <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 font-cairo">الاسم الكامل (عربي)</label>
              <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t.department}</label>
              <select required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})}>
                <option value="">{t.selectDepartment}</option>
                {MOCK_DEPARTMENTS.map(d => (
                  <option key={d.id} value={d.id}>{lang === 'ar' ? d.nameAr : d.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t.directManager}</label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.managerId} onChange={e => setFormData({...formData, managerId: e.target.value})}>
                <option value="">-- No Manager --</option>
                {MOCK_EMPLOYEES.map(emp => (
                  <option key={emp.id} value={emp.id}>{lang === 'ar' ? emp.nameAr : emp.name} ({emp.position})</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t.vacationDays} (Annual)</label>
              <input required type="number" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={formData.totalLeaveEntitlement} onChange={e => setFormData({...formData, totalLeaveEntitlement: Number(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t.basicSalary}</label>
              <input required type="number" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={formData.basicSalary} onChange={e => setFormData({...formData, basicSalary: Number(e.target.value)})} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-10 pt-6 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-8 py-2.5 rounded-xl font-bold bg-indigo-600 text-white flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
              <Save size={18} />
              Save Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
