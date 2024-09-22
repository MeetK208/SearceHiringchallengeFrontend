import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message: string, title: string) {
    const icon = '<i class="fa fa-check-circle toast-icon"></i>'; // FontAwesome check-circle
    this.toastr.success(icon + message, title, {enableHtml: true});
  }

  showError(message: string, title: string) {
    const icon = '<i class="fa fa-times-circle toast-icon"></i>'; // FontAwesome times-circle
    this.toastr.error(icon + message, title, {enableHtml: true});
  }

  showWarning(message: string, title: string) {
    const icon = '<i class="fa fa-exclamation-triangle toast-icon"></i>'; // FontAwesome exclamation-triangle
    this.toastr.warning(icon + message, title, {enableHtml: true});
  }
}
