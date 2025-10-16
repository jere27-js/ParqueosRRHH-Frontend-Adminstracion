//Get data for acceptance form
/**
export interface AcceptanceForm {
  assignmentId: string;
  parkingCardNumber: string;
  benefitType: string;
  employee: Employee;
  previousEmployee?: any;
  signatures: string;
}
interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  phone: string;
  email: string;
  subManagement: string;
  management1: string;
  vehicles: Vehicle[];
}
interface Vehicle {
  id: string;
  vehicleBadge: string;
  color: string;
  brand: string;
  model: string;
  type: string;
}
*/

export interface AcceptanceForm {
    data: Data;
  }
  interface Data {
    currAssignment: CurrAssignment;
    prevAssignment?: PrevAssignment;
    location: Location;
    headOfEmployee: HeadOfEmployee;
    signatures: string;
  }
  interface HeadOfEmployee {
    employeeCode: string;
    name: string;
    phone: string;
    email: string;
    subManagement: string;
    management1: string;
  }
  interface Location {
    id: string;
    name: string;
    address: string;
    contactReference: string;
    phone: string;
    email: string;
    comments: string;
    numberOfIdentifier: string;
    status: string;
    slots: Slot[];
  }
  interface Slot {
    id: string;
    slotNumber: string;
    slotType: string;
    limitOfAssignments: number;
    benefitType: string;
    amount: number;
    vehicleType: string;
    status: string;
  }
  interface PrevAssignment {
    id: string;
    benefitType: string;
    parkingCardNumber: string;
    status: string;
    assignmentDate: string;
    employee: Employee2;
    deAssignment: DeAssignment;
  }
  interface DeAssignment {
    id: string;
    assignment: string;
    reason: string;
    deAssignmentDate: string;
    isRpaAction: boolean;
  }
  interface Employee2 {
    id: string;
    employeeCode: string;
    name: string;
    phone: string;
    email: string;
    subManagement: string;
    management1: string;
    vehicles: Vehicle[];
  }
  interface CurrAssignment {
    assignmentId: string;
    parkingCardNumber: string;
    benefitType: string;
    employee: Employee;
  }
  interface Employee {
    id: string;
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
    accessToken?: any;
    accessTokenStatus: string;
    vehicles: Vehicle[];
  }
  interface Vehicle {
    id: string;
    vehicleBadge: string;
    color: string;
    brand: string;
    model: string;
    type: string;
  }
//End Get data for acceptance form

export interface  Signatures {
    security_boss: Person;
    parking_manager: Person;
    human_resources_manager: Person;
    human_resources_payroll: Person;
  }
  interface Person {
    name: string;
    employee_code: string;
  }

