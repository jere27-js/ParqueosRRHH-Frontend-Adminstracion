//REPORTE 1
export interface LocationReport{
    parkingName: string;
    numberOfIdentifier: string;
    noCost:string;
    reimbursement:string;
    discount:string;
    vehicleCount: string;
    motorcycleCount:string;
    truckCount:string;
    totalSpaces: string;
    occupiedSpaces: string;
    availableSpaces: string;
    occupancyRate: string;
}

//REPORTE 2
export interface EmployeeReport {
    employeeCode: string;
    employeeName: string;
    position: string;
    department: string;
    subManagement: string;
    management1: string;
    management2: string;
    address: string;
    work_site: String;
    assignment: Assignment;
  }
  interface Assignment {
    assignmentDate: string;
    slot: Slot;
    de_assignment?: any;
  }
  interface Slot {
    benefitType: string;
    location: Location;
  }
  interface Location {
    parkingName: string;
  }


//REPORTE 3
export interface EmployeeDetailCostReport {
    employeeCode: string;
    employeeName: string;
    position: string;
    department: string;
    subManagement: string;
    management1: string;
    management2: string;
    site: string;
    address: string;
    discountAmount: number;
    refundAmount: number;
    assignment: Assignment;
  }
  interface Assignment {
    benefitType: string;
    assignmentDate: string;
    slot: Slot;
  }
  interface Slot {
    volunteerNumber: string;
    location: Location;
  }
  interface Location {
    parkingName: string;
    volunteerNumber: String;
  }

//REPORTE 4
 export interface ParkingAssignedPeriodReport {
    employeeCode: string;
    employeeName: string;
    position: string;
    department: string;
    subManagement: string;
    management1: string;
    management2: string;
    site: string;
    assignment: Assignment;
  }
  interface Assignment {
    assignmentDate: string;
    slot: Slot;
  }
  interface Slot {
    id: string;
    parkingCarNumber: string;
    location: Location;
  }
  interface Location {
    id: string;
    parkingName: string;
  }
