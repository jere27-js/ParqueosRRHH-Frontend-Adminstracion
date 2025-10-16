// GET AllLocations
export interface AllLocations {
    id: string;
    name: string;
    address: string;
    contact_reference: string;
    phone: string;
    email: string;
    comments: string;
    status: string;
  }


 //GET ALL ASSIGNMENTS
 export interface AllAssignments {
    data: Datum[];
    pageCounter: number;
  }
 export interface Datum {
    id: string;
    status: string;
    assignmentDate: string;
    formDecisionDate: string;
    parkingCardNumber: string;
    benefitType: string;
    employee: Employee;
    location: Location;
    deAssignment?: DeAssignment;
    discountNote?: DiscountNote;
    assignmentLoan?: AssignmentLoan;
  }
  interface AssignmentLoan {
    id: string;
    assignmentId: string;
    employee: Employee;
    startDateAssignment: string;
    endDateAssignment: string;
    assignmentDate: string;
    status: string;
  }
  interface DiscountNote {
    id: string;
    assignmentId: string;
    maxDispatchAttempts: number;
    reminderFrequency: number;
    dispatchAttempts: number;
    lastNotice?: any;
    nextNotice?: any;
    statusSignature: string;
    statusDispatched: string;
  }
  interface DeAssignment {
    id: string;
    assignmentId: string;
    reason: string;
    deAssignmentDate: string;
    isRpaAction: boolean;
  }
  interface Location {
    id: string;
    name: string;
    slots: Slot[];
  }
  interface Slot {
    id: string;
    slotNumber: string;
  }
  interface Employee {
    id: string;
    name: string;
    email: string;
    phone: string;
    vehicles: any[];
  }
