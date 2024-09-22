import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiResponse, GetUser } from '../../types/response.type';
import { Router } from '@angular/router';
import { ProjectService } from '../Services/project.service';
import { ToastService } from '../Services/toast.service';

@Component({
  selector: 'app-project-modal',
  templateUrl: './project-modal.component.html',
  styleUrls: ['./project-modal.component.scss']
})
export class ProjectModalComponent {
  @ViewChild('projectForm') projectForm!: NgForm;
  showModal: boolean = false;
  isLoading:boolean = false;
  coPlanners:GetUser[] = [];
  selectedCoPlanners: Set<number> = new Set();

  protected isloading:boolean=false;

  getCoplanners(){
    this.isloading=true;
    this.projectServ.getCoplanners().subscribe({
      next:(resp:ApiResponse<'all_users',GetUser[]>)=>{
        this.coPlanners=resp.all_users??[]
        this.isloading=false;
      },
      error:(err:any)=>{
        this.toastServ.showError('Something went wrong! Unble to fetch coplanners','Error')
        this.isloading=false;
      }
    });

  }

  constructor(private router:Router, private projectServ:ProjectService, private toastServ:ToastService){
    this.getCoplanners();
  }

  newProject = {
    projectName: '',
    projectDesc: '',
    totalPosition: 0,
    budget: 0,
    budgetUnit: 'Cr',
    coPlanners: [] as number[]
  };

  @Output() projectAdded = new EventEmitter<any>();

  openModal() {
    this.showModal = true;
    this.resetForm();
  }

  closeModal() {
    this.showModal = false;
  }

  submitForm() {

    if (this.projectForm.valid) {
      this.isLoading=true;
      this.newProject.coPlanners = Array.from(this.selectedCoPlanners);
      console.log(this.newProject);
      const project = {
        projectName:this.newProject.projectName,
        projectDesc:this.newProject.projectDesc,
        totalPosition:(+this.newProject.totalPosition),
        budget:this.newProject.budget.toString() + ' ' + this.newProject.budgetUnit,
        collaborators:this.newProject.coPlanners??[]
      }

      this.projectServ.addProject(project).subscribe({
        next:(resp:ApiResponse<'project',any>)=>{
          // console.log(resp);
          this.closeModal();
          this.isloading=false

          this.projectAdded.emit(resp.project);
        },
        error:(err:any)=>{
          console.log(err);
          this.closeModal();
          this.isloading=false
        }
      })
      
    } else {
      this.touchAllFields();
    }
  }

  touchAllFields() {
    Object.values(this.projectForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  toggleCoPlannerSelection(userId: number, isChecked: boolean) {
    if (isChecked) {
      this.selectedCoPlanners.add(userId);
    } else {
      this.selectedCoPlanners.delete(userId);
    }
  }

  resetForm() {
    this.newProject = {
      projectName: '',
      projectDesc: '',
      totalPosition: 0,
      budget: 0,
      budgetUnit: 'Cr',
      coPlanners: []
    };
    this.selectedCoPlanners.clear();
  }

  onContainerClicked(event: MouseEvent) {
    if ((event.target as Element).classList.contains('fixed')) {
      this.closeModal();
    }
  }
}
