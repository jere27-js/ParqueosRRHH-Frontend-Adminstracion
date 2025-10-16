import { Component, OnInit } from '@angular/core';
import { AssignmentsService } from 'src/app/core/service/assigned/assignments.service';
import { Assignments } from 'src/app/core/api/assignment/assignment.model';


interface VehicleType {
    id?: number;
    name?: string;
  }



@Component({
  selector: 'app-crud-vehicles',
  standalone: false,
  templateUrl: './crud-vehicles.component.html',
  styleUrl: './crud-vehicles.component.scss'
})
export class CrudVehiclesComponent  {


    vehicleTypes: VehicleType[] = [];
    vehicleTypeDialog: boolean = false;
    vehicleType: VehicleType = {};
    selectedVehicleTypes: VehicleType[] = [];
    submitted: boolean = false;

    openNew() {
      this.vehicleType = {};
      this.submitted = false;
      this.vehicleTypeDialog = true;
    }

    editVehicleType(vehicleType: VehicleType) {
      this.vehicleType = { ...vehicleType };
      this.vehicleTypeDialog = true;
    }

    deleteVehicleType(vehicleType: VehicleType) {
      this.vehicleTypes = this.vehicleTypes.filter(val => val.id !== vehicleType.id);
      this.vehicleType = {};
    }

    hideDialog() {
      this.vehicleTypeDialog = false;
      this.submitted = false;
    }

    saveVehicleType() {
      this.submitted = true;

      if (this.vehicleType.name?.trim()) {
        if (this.vehicleType.id) {
          this.vehicleTypes[this.findIndexById(this.vehicleType.id)] = this.vehicleType;
        } else {
          this.vehicleType.id = this.createId();
          this.vehicleTypes.push(this.vehicleType);
        }

        this.vehicleTypes = [...this.vehicleTypes];
        this.vehicleTypeDialog = false;
        this.vehicleType = {};
      }
    }

    findIndexById(id: number): number {
      return this.vehicleTypes.findIndex(vehicleType => vehicleType.id === id);
    }

    createId(): number {
      return Math.floor(Math.random() * 1000);
    }



    // ASSIGNMENTS
    assignment: Assignments;
/**
    assignment = {
        status: '',
        assignmentDate: '',
        formDecisionDate: '',
        parkingCardNumber: '',
        benefitType: '',
        employee: {
          name: '',
          email: '',
          phone: '',
          vehicles: [
            {
              vehicleBadge: '',
              color: '',
              brand: '',
              model: '',
              type: ''
            }
          ]
        },
        location: {
          name: '',
          slots: [
            {
              slotNumber: ''
            }
          ]
        }
      };
*/

      constructor(private assignmentService: AssignmentsService) { }

      onSubmit() {
        this.assignmentService.createAssignment(this.assignment).subscribe((response: Assignments) => {
          console.log('Assignment created:', response);
        });
      }

}
