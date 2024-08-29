import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { Storage } from 'src/app/shared/interfaces/storage.interface';
import { environment } from 'src/environments/environment';

@Component({
  standalone: true,
  selector: 'app-dialog-storage-detail',
  templateUrl: './dialog-storage-detail.component.html',
  styleUrls: ['./dialog-storage-detail.component.scss'],
  imports: [
    MaterialModule,
    CommonModule
  ]
})
export class DialogStorageDetailComponent implements OnInit {

  storage!: Storage;
  load = true;
  permissions: string[] = [];
  info_values = { total_art: 0, total_inv: 0 };
  add_product_admin = environment.EDIT_PRODUCT_CONTROL;

  private employeeSubscription: Subscription | undefined;

  constructor(
    public dialogRef: MatDialogRef<DialogStorageDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private router: Router,
    private conectorsService: ConectorsService
  ) { }

  ngOnInit(): void {
    this.getDataLocal();
    this.loadStorageData(this.data.id_storage);
  }

  getDataLocal(): void {
    this.employeeSubscription = this.conectorsService.getEmployee().subscribe(
      (employee: Employee) => {
        this.permissions = employee.list_of_permissions.split(',');
        this.getDataInfo(employee.id_enterprise, this.data.id_storage);
      },
      error => {
        console.error(error);
      }
    );
  }

  loadStorageData(id_storage: number): void {
    this.getStorage(id_storage);
  }

  getStorage(id_storage: number): void {
    this.apiService.postTypeRequest('profile/get-storage-id', { id_storage }).subscribe(
      (value: any) => {
        if (value.data && value.data.length > 0) {
          this.storage = value.data[0]; // Adjust based on your response structure
          this.load = false;
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  getDataInfo(id_enterprise: number, id_storage: number): void {
    this.apiService.postTypeRequest('profile/get-storage-data', { id_enterprise, id_storage }).subscribe(
      (value: any) => {
        if (value.data && value.data.length > 1) {
          this.info_values = {
            total_art: value.data[0].data || 0,
            total_inv: value.data[1].data || 0
          };
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  editStorage(id_storage: number): void {
    this.closeDialog();
    this.router.navigate(['init/main/storage/storage-edit'], { queryParams: { id_storage } });
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }

  ngOnDestroy(): void {
    if (this.employeeSubscription) {
      this.employeeSubscription.unsubscribe();
    }
  }

}

