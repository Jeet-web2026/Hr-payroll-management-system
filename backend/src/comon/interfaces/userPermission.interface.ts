export interface UserPermission {
  manageUser?: boolean;
  notifications?: boolean;
  dashboard?: {
    totalEmployeeCount?: boolean;
    newJoineesCount?: boolean;
    activeEmployeeCount?: boolean;
    joiningRateCount?: boolean;
    totalGrowth?: {
      type?: string;
    };
  };
  holidayManagement?: boolean;
  employeeManagement?: boolean;
  attendanceManagement?: boolean;
  payrollManagement?: boolean;
  leaveManagement?: boolean;
  recruitmentManagement?: boolean;
}
