import { Component } from '@angular/core';
import { Collaborator, Project } from '../../types/project.type';
import { Router } from '@angular/router';
import { ProjectService } from '../Services/project.service';
import { ApiResponse, GetUser } from '../../types/response.type';
import { ToastService } from '../Services/toast.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  projects: Project[] = [];
  coplanners:GetUser[]=[];
  currCoplanners:number[]=[];
  protected isloading:boolean=false;


  getProjects(){
    this.isloading=true;
    this.projectServ.getProjects().subscribe({
      next:(resp:ApiResponse<'projects',Project[]>)=>{
        this.projects=resp.projects??[]
        this.isloading=false;
      },
      error:(err:any)=>{
        this.toastServ.showError('Something went wrong! Unble to fetch projects','Error')
        this.isloading=false;
      }
    });
  }

  getCoplanners(){
    this.isloading=true;
    this.projectServ.getCoplanners().subscribe({
      next:(resp:ApiResponse<'all_users',GetUser[]>)=>{
        this.coplanners=resp.all_users??[]
        this.isloading=false;
      },
      error:(err:any)=>{
        this.toastServ.showError('Something went wrong! Unble to fetch coplanners','Error')
        this.isloading=false;
      }
    });

  }

  constructor(private router:Router, private projectServ:ProjectService, private toastServ:ToastService){
    this.getProjects();
    // this.getCoplanners();
  }

  

  handleProjectClick(id:number){
    console.log(id);
    this.router.navigate([`/dashboard/project/${id}`])
  }

  addProject( project:Project) {
    // if(flag===true){
    //   this.router.navigate(['/dashboard/project/add'])
    // }
    this.projects.push(project)
  }

  getCoplannerString(coPlanner:Collaborator[]){
    const names = coPlanner.map(c=>c.name);
    return names.join(', ');
  }


}
