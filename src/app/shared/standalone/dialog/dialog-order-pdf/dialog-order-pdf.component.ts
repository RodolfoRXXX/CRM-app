import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { environment } from 'src/enviroments/enviroment';
import { catchError, map, merge, startWith, switchMap, of as observableOf} from 'rxjs';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { Customer } from 'src/app/shared/interfaces/customer.interface';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  standalone: true,
  selector: 'app-dialog-order-pdf',
  templateUrl: './dialog-order-pdf.component.html',
  styleUrls: ['./dialog-order-pdf.component.scss'],
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class DialogOrderPdfComponent implements OnInit {

  @ViewChild('input') input!: ElementRef;

  emailReg = new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");
  dataForm!: FormGroup;
  employee!: Employee;
  order!: any;
  uriImg = environment.SERVER;
  load: boolean = true;
  loading: boolean = false;
  optionBox:boolean = false;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['name'];
  isNewCustomer: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogOrderPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _api: ApiService,
    private _conector: ConectorsService,
    public _auth: AuthService,
    private _notify: NotificationService
  ) {
    console.log(this.data)
  }
  ngOnInit(): void {
    this.getOrder();
  }

  private getDataLocal(): number {
    this._conector.getEmployee().subscribe((item: Employee) => {
      this.employee = item;
    });
    return this.employee.id_enterprise;
  }

  //trae toda la información de la orden para armar el remito
  getOrder() {
    this.load = true;
    //Obtener la información del producto
    this._api.postTypeRequest('profile/get-order-detail-by-id', { id_order: this.data }).subscribe( (value: any) => {
      if (value.data) {
        //Si existe el producto lo carga
        this.order = value.data[0];
        console.log(value.data)
      } else {
        //Si NO existe el producto centonces cierra el dialog como error
        //this.closeDialog();
      }
      this.load = false;
    })
  }

  //Cierra la ventana de diálogo
  closeDialog(response: any): void {
    this.dialogRef.close(response);
  }

}

