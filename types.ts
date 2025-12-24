
export type Language = 'en' | 'ar';

export interface Translation {
  dashboard: string;
  employees: string;
  payroll: string;
  attendance: string;
  settings: string;
  subscription: string;
  aiAssistant: string;
  totalEmployees: string;
  pendingLeaves: string;
  activeContracts: string;
  monthlyPayroll: string;
  search: string;
  addEmployee: string;
  name: string;
  position: string;
  department: string;
  status: string;
  action: string;
  trialMessage: string;
  upgradeNow: string;
  complianceMode: string;
  ksa: string;
  uae: string;
  egypt: string;
  qatar: string;
  basicSalary: string;
  allowances: string;
  deductions: string;
  netSalary: string;
  paymentMethod: string;
  cash: string;
  bank: string;
  bankName: string;
  accountNumber: string;
  export: string;
  employeeId: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  nationality: string;
  profilePicture: string;
  selectDepartment: string;
  clockIn: string;
  clockOut: string;
  startBreak: string;
  endBreak: string;
  leaveBalance: string;
  applyLeave: string;
  myPortal: string;
  adminPanel: string;
  location: string;
  workingHours: string;
  bonuses: string;
  fixedAmount: string;
  percentage: string;
  days: string;
  addAdjustment: string;
  type: string;
  value: string;
  reason: string;
  vacationDays: string;
  grossSalary: string;
  directManager: string;
  approve: string;
  reject: string;
  pending: string;
  leaveType: string;
  annual: string;
  sick: string;
  emergency: string;
  startDate: string;
  endDate: string;
  salarySlip: string;
  payPeriod: string;
  earnings: string;
  totalEarnings: string;
  totalDeductions: string;
  netPayable: string;
  print: string;
  deductionReason: string;
}

export enum EmployeeStatus {
  Active = 'Active',
  OnLeave = 'OnLeave',
  Terminated = 'Terminated',
  Inactive = 'Inactive'
}

export type PaymentMethod = 'Cash' | 'Bank';
export type AdjustmentCategory = 'Bonus' | 'Deduction';
export type AdjustmentValueType = 'Fixed' | 'Percentage' | 'Days';

export interface PayrollAdjustment {
  id: string;
  category: AdjustmentCategory;
  type: AdjustmentValueType;
  value: number;
  reason: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  nameAr: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  nationality: string;
  nationalityAr: string;
  profilePicture?: string;
  position: string;
  positionAr: string;
  department: string;
  departmentAr: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  deductionReason?: string;
  adjustments: PayrollAdjustment[];
  joinDate: string;
  status: EmployeeStatus;
  paymentMethod: PaymentMethod;
  bankName?: string;
  accountNumber?: string;
  leaveBalance: number;
  totalLeaveEntitlement: number;
  managerId?: string;
}

export interface Department {
  id: string;
  name: string;
  nameAr: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  breakStart?: string;
  breakEnd?: string;
  location?: { lat: number; lng: number };
}

export type LeaveType = 'Annual' | 'Sick' | 'Emergency';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  reason: string;
  createdAt: string;
}
