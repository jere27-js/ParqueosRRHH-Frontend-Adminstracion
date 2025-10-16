
// Api Get employee
/**
export interface GetEmployee {
    id: number;
    name: string;
    company: Company;
    address: Address;
    email: string;
    phone: string;
    vehicles: any[];
  }
  interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
  }
  interface Geo {
    lat: string;
    lng: string;
  }
  interface Company {
    name: string;
    catchPhrase: string;
    bs: string;
  }
*/

export interface GetEmployee {
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
    bossCode: string;
    bossName: string;
    bossWorkplace: string;
    bossManagement: string;
    bossEmail: string;
    bossPhone: string;
    vehicles: any[];
    employeeHasActiveAssignments: any;
  }
// End Get employee



//Api Create assignments
export interface Assignments {
    slotId: string;
    parkingCardNumber: string;
    employee: Employee;
    tags: string[];
  }
  interface Employee {
    id?: string;
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
    vehiclesForDelete?: Vehicle[];
  }
  interface Vehicle {
    id?: string;
    vehicleBadge: string;
    color: string;
    brand: string;
    model: string;
    type: string;
  }
  //End Create assignments


 //Api Get all tags

 export interface Tag {
    id: string;
    name: string;
    description: string;
    status: string;
  }
 //End Get all tags

