import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from '../Services/project.service';
import { ToastService } from '../Services/toast.service';
import { ApiResponse2 } from '../../types/response.type';

@Component({
  selector: 'app-new-user-modal',
  templateUrl: './new-user-modal.component.html',
  styleUrl: './new-user-modal.component.scss',
})
export class NewUserModalComponent implements OnInit {
  userForm: FormGroup;
  isloading: boolean = false;
  message: string = 'Add New User';
  isEdit: boolean = false;
  isDelete: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<NewUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectService,
    private toastServ: ToastService
  ) {
    this.userForm = new FormGroup({
      designation: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      department: new FormControl('', Validators.required),
      budget: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      budgetUnit: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    // console.log(this.data);
    if (this.data?.edit === true) {
      this.isEdit = true;
      this.message = 'Edit User';
      const str = this.data?.user?.budget;
      const b = str.split(' ');
      this.userForm.patchValue({
        designation: this.data?.user?.designation,
        department: this.data?.user?.department,
        location: this.data?.user?.location,
        budget: b[0],
        budgetUnit: b[1],
      });
    }

    if (this.data?.delete === true) {
      this.isDelete = true;
      this.message = `Are you sure you want to delete ${this.data.user?.designation} designation ?`;
    }
  }

  onDelete() {
    this.isloading = true;
    this.projectService
      .deleteUser(+this.data.projId, +this.data?.user?.carduserId)
      .subscribe({
        next: (resp: any) => {
          // console.log(resp);

          // debugger;
          this.projectService.getProjectbyId(+this.data.projId, 1).subscribe({
            next: (resp: ApiResponse2) => {
              this.toastServ.showSuccess('User Deleted !', '');
              this.dialogRef.close({
                userCards: resp.results.userCards,
                dashboardMatrix: resp.results.DashboardMatrix,
              });
              this.isloading = false;
            },
            error: (err: any) => {
              console.log(err);
              this.isloading = false;
            },
          });
        },
        error: (err: any) => {
          // console.log(err);
          this.isloading = false;
        },
      });
  }

  submitForm() {
    if (this.userForm.valid) {
      // console.log(this.userForm.value);
      const formValue = this.userForm.value;
      //   "designation": "Senior Engineer",
      // "department": "Engineer",
      // "budget": "2 Cr",
      // "location": "Las Vegas"
      // Process the form submission here
      this.isloading = true;

      const body = {
        designation: formValue.designation,
        department: formValue.department,
        budget: formValue.budget + ' ' + formValue.budgetUnit,
        location: formValue.location,
      };
      // console.log(body);
      if (this.isEdit) {
        this.projectService
          .updateUser(body, +this.data.projId, +this.data?.user?.carduserId)
          .subscribe({
            next: (resp: any) => {
              // console.log(resp);

              this.toastServ.showSuccess('User Updated successfully', '');
              // debugger;
              this.projectService
                .getProjectbyId(+this.data.projId, 1)
                .subscribe({
                  next: (resp: ApiResponse2) => {
                    // debugger;
                    // console.log({
                    //   userCards: resp.results.userCards,
                    //   dashboardMatrix: resp.results.DashboardMatrix,
                    // });
                    this.dialogRef.close({
                      userCards: resp.results.userCards,
                      dashboardMatrix: resp.results.DashboardMatrix,
                    });
                    this.isloading = false;
                  },
                  error: (err: any) => {
                    console.log(err);
                    this.isloading = false;
                  },
                });
            },
            error: (err: any) => {
              // console.log(err);
              this.toastServ.showError(err.error.message, 'Error');
              this.dialogRef.close(null);
              this.isloading = false;
            },
          });
      } else {
        this.projectService.addUser(body, +this.data.projId).subscribe({
          next: (resp: any) => {
            console.log(resp);

            this.toastServ.showSuccess('User Added successfully', '');
            // debugger;
            this.projectService.getProjectbyId(+this.data.projId, 1).subscribe({
              next: (resp: any) => {
                this.dialogRef.close({
                  userCards: resp.results.userCards,
                  dashboardMatrix: resp.results.DashboardMatrix,
                });
                this.isloading = false;
              },
              error: (err: any) => {
                console.log(err);
              },
            });
          },
          error: (err: any) => {
            // console.log(err);
            this.toastServ.showError(err.error.message, 'Error');
            this.dialogRef.close(null);
            this.isloading = false;
          },
        });
      }
    } else {
      this.userForm.markAllAsTouched(); // This will trigger the display of validation messages
    }
  }
}
