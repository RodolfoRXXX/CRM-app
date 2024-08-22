import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/enviroments/enviroment';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

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
  @ViewChild('remitoPdf') remitoPdf!: ElementRef;

  emailReg = new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");
  dataForm!: FormGroup;
  employee!: Employee;
  order!: any;
  uriImg = environment.SERVER;
  load: boolean = true;
  loading: boolean = false;
  optionBox: boolean = false;
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
    console.log(this.data);
  }

  ngOnInit(): void {
    this.getOrder();
  }

  private getDataLocal(): number {
    this._conector.getEmployee().subscribe((item: Employee) => {
      this.employee = item;
    });
    return this.employee ? this.employee.id_enterprise : 0;
  }

  // Trae toda la información de la orden para armar el remito
  getOrder() {
    this.load = true;
    // Obtener la información del producto
    this._api.postTypeRequest('profile/get-order-detail-by-id', { id_order: this.data }).subscribe((value: any) => {
      if (value.data) {
        // Si existe el producto lo carga
        value.data[0].detail = JSON.parse(value.data[0].detail);
        value.data[0].shipment = value.data[0].shipment ? JSON.parse(value.data[0].shipment) : '';
        this.order = value.data[0];
        console.log(value.data);
      } else {
        // Si NO existe el producto entonces cierra el dialog como error
        this.closeDialog('error');
      }
      this.load = false;
    }, error => {
      console.error('Error fetching order details', error);
      this.load = false;
    });
  }

  generatePDF() {

    const documentDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60], // Márgenes de la página
      content: [
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: this.order ? this.order.e_name : 'Sin información', style: 'companyName' },
                { text: this.order ? this.order.e_address : 'Sin información' },
                { text: (this.order?.e_city ? this.order.e_city + ', ' : '') + (this.order?.e_state || '') },
                { text: (this.order?.e_cp ? this.order.e_cp + ', ' : '') + (this.order?.e_country || '') },
                { text: 'Tel: ' + (this.order ? this.order.e_phone : 'Sin información') }
              ]
            },
            {
              width: '50%',
              stack: [
                { text: 'Remito', style: 'header', alignment: 'right' },
                { text: 'Número: ' + (this.order?.nroRemito || ''), alignment: 'right' },
                { text: 'Fecha: ' + (this.order?.date ? new Date(this.order.date).toLocaleDateString('es-AR') : ''), alignment: 'right' },
                { text: 'CUIT: ' + (this.order?.e_cuit || 'Sin información'), alignment: 'right' }
              ]
            }
          ]
        },
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 }] }, // Separador
    
        { text: 'Cliente', style: 'subheader', margin: [0, 10, 0, 5] },
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: this.order ? this.order.c_name : 'Sin información', style: 'clientName' },
                { text: 'Tel: ' + (this.order?.c_phone || '') },
                { text: 'CUIT/L: ' + (this.order?.c_cuit || '') }
              ]
            },
            {
              width: '50%',
              stack: [
                { text: this.order ? this.order.c_address : 'Sin información' },
                { text: (this.order?.c_city ? this.order.c_city + ', ' : '') + (this.order?.c_state || '') },
                { text: this.order?.c_country || '' }
              ]
            }
          ]
        },
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 }] }, // Separador
    
        { text: 'Productos', style: 'subheader', margin: [0, 10, 0, 5] },
        {
          table: {
            widths: ['auto', 'auto', '*'],
            body: (() => {
              const body = [
                [
                  { text: 'Código', style: 'tableHeader' },
                  { text: 'Cantidad', style: 'tableHeader' },
                  { text: 'Descripción', style: 'tableHeader' }
                ]
              ];
    
              // Añadir las filas con los productos
              const rows = this.order?.detail || [];
              rows.forEach((item: any) => {
                body.push([
                  item.sku,
                  item.qty,
                  item.name
                ]);
              });
    
              // Rellenar con filas vacías hasta alcanzar 10 filas
              for (let i = rows.length; i < 10; i++) {
                body.push([{text: '-', style: 'tall'}, {text: '', style: 'tall'}, {text: '', style: 'tall'}]);
              }
    
              return body;
            })()
          },
          layout: {
            fillColor: function (rowIndex: any) {
              return (rowIndex % 2 === 0) ? '#f3f3f3' : null;
            }
          }
        },
        { text: 'Entrega', style: 'subheader', margin: [0, 10, 0, 5] },
        ...(this.order?.shipment
          ? [
              { text: `${this.order.shipment.address}, ${this.order.shipment.betweenStreets || ''}`, margin: [0, 5, 0, 0] },
              { text: `${this.order.shipment.cp}, ${this.order.shipment.city}, ${this.order.shipment.state}, ${this.order.shipment.country}`, margin: [0, 5, 0, 0] },
              { text: `Horario: ${this.order.shipment.schedule}`, margin: [0, 5, 0, 0] }
            ]
          : []),
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 }] }, // Separador
    
        {
          columns: [
            {
              width: '50%',
              text: 'Firma Remitente: ____________________________',
              margin: [0, 20, 0, 5]
            },
            {
              width: '50%',
              text: 'Firma Destinatario: ___________________________',
              alignment: 'right',
              margin: [0, 20, 0, 5]
            }
          ]
        },
        { text: 'Observaciones:', style: 'subheader', margin: [0, 10, 0, 5] },
        { text: this.order?.observation || 'Sin observaciones' },
        { text: '', margin: [0, 0, 0, 'auto'] } // Ajusta para ocupar todo el alto
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        companyName: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 5]
        },
        clientName: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 5]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        tall: {
          height: 50
        }
      }
    };

    //pdfMake.createPdf(documentDefinition).download('document.pdf');
    const pdf = pdfMake.createPdf(documentDefinition);
    pdf.open();

  }

  // Cierra la ventana de diálogo
  closeDialog(response: any): void {
    this.dialogRef.close(response);
  }
}

