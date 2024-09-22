import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Adjust the import based on your service location
import { ProjectService } from '../Services/project.service';
import {
  ApiResponse2,
  DashboardMatrix,
  UserCard,
} from '../../types/response.type';
import { ToastService } from '../Services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { NewUserModalComponent } from '../new-user-modal/new-user-modal.component';
// import { NewUserModalComponent } from './new-user-modal/new-user-modal.component';
import * as Highcharts from 'highcharts';
import HC_Pie from 'highcharts/modules/variable-pie'; // Import the pie module

HC_Pie(Highcharts);
@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'], // Changed styleUrl to styleUrls (correct Angular property)
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  projectId: number | null = null;
  currPage: number = 1;
  projectDetails: any; // Define a type according to your project's structure
  userCards: UserCard[] = [];
  dashboardMatrix: DashboardMatrix[] = [];
  totalBudget: number = 0;  // Default total budget
  isloading: boolean = false;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10; // You can adjust the number of items per page here
  displayedColumns: string[] = [
    'srNo',
    'designation',
    'department',
    'budget',
    'location',
    'last_updated',
    'actions',
  ];
  searchText: string = '';
  searchCategory: string = 'designation';
  Highcharts = Highcharts;
  private chart: Highcharts.Chart | undefined;
  isSearchResult: boolean = false;
  editBudget: boolean = false;
  editBudgetValue!: number;
  // Pie chart options
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: '#f3f3f3', // Ensuring there's a visible background
    },
    title: {
      text: 'Department Usage Percentage',
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        },
        showInLegend: true, // Optionally display legend
      },
    },
    series: [
      {
        type: 'pie',
        name: 'Usage',
        data: [],
      },
    ],
  };

  constructor(
    private route: ActivatedRoute,
    private toasterServ: ToastService,
    public dialog: MatDialog,
    public router: Router,
    private projectService: ProjectService // Inject the service
  ) {}
  ngOnDestroy(): void {
    if (this.chart) {
      try {
        // Manually clear series and elements before destroying
        while (this.chart.series.length) {
          this.chart.series[0].remove(false);
        }
  
        // Now safely destroy the chart instance
        this.chart.destroy();
        this.chart = undefined;
      } catch (error) {
        console.error("Error while destroying the chart:", error);
      }
    }
  }
  
  

  goBack(){
    // debugger;
    // this.router.navigate(['/dashboard/project'])
    window.location.href='/dashboard/project'
  }

  toggleEditBudget() {
    this.editBudget = !this.editBudget;
    this.editBudgetValue = this.totalBudget;  // Initialize with current total budget
  }

  saveBudget() {
    if(this.projectId){
      this.isloading=true;
      this.projectService.updateBudget(this.editBudgetValue.toString(),this.projectId).subscribe({
        next:(resp:any)=>{
          // console.log(resp);
          this.totalBudget = this.editBudgetValue;  // Save edited budget
          this.editBudget = false;
          this.toasterServ.showSuccess('Budget Updated Successfully','')
          this.isloading=false
        },
        error:(err:any)=>{
          console.log(err);
          this.toasterServ.showError('Something went wrong','')
          this.isloading=false
        }
      })

      // Optionally, save the updated budget back to the server here
    }
  }

  ngOnInit(): void {
    this.searchText = '';
    this.projectId = +(this.route.snapshot.paramMap.get('id') ?? 0);
    if (this.projectId) {
      this.isSearchResult = false;
      this.getProjectById(+this.projectId, this.currentPage);
    }
  }

  openNewUserModal() {
    const dialogRef = this.dialog.open(NewUserModalComponent, {
      width: '600px',
      data: { projId: this.projectId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('rrr0');
        console.log(result);
        this.userCards = result.userCards;
        this.dashboardMatrix = result.dashboardMatrix
        this.updatePieChart(this.dashboardMatrix);
      }
      
    });
  }

  search() {
    this.searchText = this.searchText.trim();
    if (this.searchText && this.projectId) {
      this.isloading = true;
      this.projectService
        .searchUser(+this.projectId, this.searchCategory, this.searchText)
        .subscribe({
          next: (resp: ApiResponse2) => {
            // console.log(resp);
            this.isSearchResult = true;
            this.userCards = resp.results.userCards;
            this.isloading = false;
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }
  }

  getProjectById(id: number, pageNo: number): void {
    this.isloading = true;
    this.projectService.getProjectbyId(id, pageNo).subscribe(
      (response: ApiResponse2) => {
        console.log(response);
        this.projectDetails = response.results;
        this.userCards = response.results?.userCards;
        this.dashboardMatrix = response.results?.DashboardMatrix;
        this.updatePieChart(response.results?.DashboardMatrix);
        this.isloading = false;
        this.currentPage = pageNo;
        this.totalPages = response.results.total_pages;
        // console.log(response.results.totalBudget);
        const arr = response.results.totalBudget.split(' ')
        this.totalBudget=+arr[0]
      },
      (error) => {
        console.error('Error fetching project details:', error);
        this.isloading = false;
        // Handle the error as needed
      }
    );
  }

  // Method to update the chart data
  updatePieChart(data: DashboardMatrix[]): void {
    if(data){
      const chartData = data.map((item) => ({
        name: item.department,
        y: parseFloat(item.percentage_used.toString()),
      }));
  
      this.chartOptions.series = [
        {
          type: 'pie',
          name: 'Department Usage',
          data: chartData,
        },
      ];
      if (!this.chart) {
        this.chart = Highcharts.chart('container', this.chartOptions); // Make sure to initialize the chart correctly
      }
      this.chart.series[0].setData(chartData, true); // Update data safely
    }
    else{
      this.toasterServ.showError('Unable to update Chart','')
    }
    
  }

  editCard(ele: UserCard) {
    // console.log(ele);
    const dialogRef = this.dialog.open(NewUserModalComponent, {
      width: '600px',
      data: { projId: this.projectId, edit: true, user: ele },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userCards = result.userCards;
        this.dashboardMatrix = result.dashBoardMatrix;
        this.updatePieChart(this.dashboardMatrix);
      }
    });
  }

  deleteCard(ele: UserCard) {
    const dialogRef = this.dialog.open(NewUserModalComponent, {
      width: '600px',
      data: { projId: this.projectId, delete: true, user: ele },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userCards = result.userCards;
        this.dashboardMatrix = result.dashBoardMatrix;
        this.updatePieChart(result.dashBoardMatrix);
      }
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      // this.loadUsers(this.currentPage);
      if (this.projectId) {
        this.getProjectById(+this.projectId, this.currentPage);
      }
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      if (this.projectId) {
        this.getProjectById(+this.projectId, this.currentPage);
      }
    }
  }
}
