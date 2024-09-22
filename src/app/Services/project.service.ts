import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { ApiResponse, ApiResponse2, GetUser } from '../../types/response.type';
import { Project } from '../../types/project.type';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private endpoint = environment.apiUrl;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getProjects() {
    // debugger;
    const email = this.cookieService.get('email');
    const userId = this.cookieService.get('userId');
    const headers = {
      Cookies: `email="${email}"; userId=${+userId}`,
    };
    return this.http.get<ApiResponse<'projects', Project[]>>(
      this.endpoint + '/user-projects/get-all',
      { headers }
    );
  }

  getProjectbyId(projId: number, pageNo: number) {
    // debugger;
    const email = this.cookieService.get('email');
    const userId = this.cookieService.get('userId');
    const headers = {
      Cookies: `email="${email}"; userId=${+userId}`,
    };
    return this.http.get<ApiResponse2>(
      this.endpoint +
        `/project-list/get-all?projectId=${projId}&page=${pageNo}`,
      { headers }
    );
  }

  addProject(project: any) {
    const email = this.cookieService.get('email');
    const userId = this.cookieService.get('userId');
    const headers = {
      Cookies: `email="${email}"; userId=${+userId}`,
    };
    return this.http.post<ApiResponse<'project', any>>(
      this.endpoint + '/user-projects/create-project',
      project,
      { headers }
    );
  }

  getCoplanners() {
    const email = this.cookieService.get('email');
    const userId = this.cookieService.get('userId');
    const headers = {
      Cookies: `email="${email}"; userId=${+userId}`,
    };
    return this.http.get<ApiResponse<'all_users', GetUser[]>>(
      this.endpoint + '/user-projects/all-user',
      { headers }
    );
  }

  addUser(user: any, projId: number) {
    const email = this.cookieService.get('email');
    const userId = this.cookieService.get('userId');
    const headers = {
      Cookies: `email="${email}"; userId=${+userId}`,
    };
    return this.http.post<ApiResponse<'project_card_user', any>>(
      this.endpoint + `/project-list/create-user?projectId=${projId}`,
      user,
      { headers }
    );
  }

  updateUser(user: any, projId: number, cardId: number) {
    const email = this.cookieService.get('email');
    const userId = this.cookieService.get('userId');
    const headers = {
      Cookies: `email="${email}"; userId=${+userId}`,
    };
    return this.http.put<ApiResponse<'userCard', any>>(
      this.endpoint +
        `/project-list/update-user?projectId=${projId}&cardId=${cardId}`,
      user,
      { headers }
    );
  }

  deleteUser(projId: number, cardId: number) {
    const email = this.cookieService.get('email');
    const userId = this.cookieService.get('userId');
    const headers = {
      Cookies: `email="${email}"; userId=${+userId}`,
    };
    return this.http.delete<ApiResponse<'userCard', any>>(
      this.endpoint +
        `/project-list/delete-user?projectId=${projId}&cardId=${cardId}`,
      { headers }
    );
  }

  searchUser(projId: number, key: string, value: string) {
    const email = this.cookieService.get('email');
    const userId = this.cookieService.get('userId');
    const headers = {
      Cookies: `email="${email}"; userId=${+userId}`,
    };
    return this.http.get<ApiResponse2>(
      this.endpoint +
        `/project-list/search-user?projectId=${projId}&${key}=${value}`,
      { headers }
    );
  }

  updateBudget(newBudget:string, projId:number){
    const email = this.cookieService.get('email');
    const userId = this.cookieService.get('userId');
    const headers = {
      Cookies: `email="${email}"; userId=${+userId}`,
      };
      return this.http.put(this.endpoint+`/project-list/update-budgate?projectId=${projId}`,{budget:newBudget},{ headers })
  }
}
