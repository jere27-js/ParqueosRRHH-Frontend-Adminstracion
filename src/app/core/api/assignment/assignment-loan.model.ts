export interface AssignmentLoan {
    startDateAssignment: string;
    endDateAssignment: string;
    employee: Employee;
  }
  interface Employee {
    employeeCode: string;
    name: string;
    workplace: string;
    identifierDocument: string;
    company: string;
    department: string;
    subManagement: string;
    management1: string;
    management2: string;
    workSite: string;
    address: string;
    email: string;
    phone: string;
    vehicles: Vehicle[];
  }
  interface Vehicle {
    vehicleBadge: string;
    color: string;
    brand: string;
    model: string;
    type: string;
  }
