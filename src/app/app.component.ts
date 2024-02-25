import {Component, OnInit} from '@angular/core';
import {EmployeeService} from './employee.service';
import {Employee} from './employee';
import {HttpErrorResponse} from '@angular/common/http';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'employeemanagerapp';

  public employees: Employee[] = [];
  public editEmployee: Employee | null = null;
  public deleteEmployee: Employee | null = null;

  constructor(private employeeService: EmployeeService) {
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployees(key: string): void{
    console.log(key);
    const results: Employee[] = [];
    for(let employee of this.employees){
      if(employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
      ||employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
      ||employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      ||employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1){
        results.push(employee);
      }
    }
    this.employees = results;
    if(results.length === 0 || !key){
      this.getEmployees();
    }
  }
  public onOpenModal(employee: Employee | null, mode: String): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';

    button.setAttribute('data-toggle', 'modal');

    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    } else if (mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    } else if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container?.appendChild(button);
    button.click();
  }

  public onAddEmployee(addForm: NgForm): void {
    const button = document.getElementById('add-employee-form');
    button?.click();

    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.resetForm();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateEmployee(employee: Employee): void {
    const button = document.getElementById('edit-employee-form')
    button?.click();

    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  public onDeleteEmployee(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }
}
