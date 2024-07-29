import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-dialog-order-edit-shipment',
  templateUrl: './dialog-order-edit-shipment.component.html',
  styleUrls: ['./dialog-order-edit-shipment.component.scss'],
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class DialogOrderEditShipmentComponent implements OnInit {

  dataForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogOrderEditShipmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _auth: AuthService
  ) {
    
  }
  ngOnInit(): void {
    this.createDataForm()
    this.setDataform()
  }

  //Edita datos de envío
  createDataForm() {
    this.dataForm = new FormGroup({
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]),
      betweenStreets: new FormControl('', [
        Validators.minLength(5),
        Validators.maxLength(100)
      ]),
      cp: new FormControl('', [
        Validators.minLength(2),
        Validators.maxLength(10)
      ]),
      city: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50)
      ]),
      state: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50)
      ]),
      country: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50)
      ]),
      schedule: new FormControl('', [
        Validators.minLength(5),
        Validators.maxLength(100)
      ])
    })
  }

  //Setea los valores del formulario en caso de que los hubiera
  setDataform() {
    if(this.data.shipment) {
      this.dataForm.patchValue({
        address: (this.data.shipment.address)?this.data.shipment.address:'',
        betweenStreets: (this.data.shipment.betweenStreets)?this.data.shipment.betweenStreets:'',
        cp: (this.data.shipment.cp)?this.data.shipment.cp:'',
        city: (this.data.shipment.city)?this.data.shipment.city:'',
        state: (this.data.shipment.state)?this.data.shipment.state:'',
        country: (this.data.shipment.country)?this.data.shipment.country:'',
        schedule: (this.data.shipment.schedule)?this.data.shipment.schedule:''
      })
    }
  }

    //Mensajes de error
    getErrorAddress() {
      //address
      if(this.dataForm.controls['address'].hasError('required')) return 'Tenés que ingresar un valor';
      if(this.dataForm.controls['address'].hasError('minlength')) return 'Este valor debe tener más de 5 caracteres';
      if(this.dataForm.controls['address'].hasError('maxlength')) return 'Este valor debe tener menos de 100 caracteres';
      return ''
    }
    getErrorBetweenStreets() {
      //betweenStreets
      if(this.dataForm.controls['betweenStreets'].hasError('minlength')) return 'Este valor debe tener más de 5 caracteres';
      if(this.dataForm.controls['betweenStreets'].hasError('maxlength')) return 'Este valor debe tener menos de 100 caracteres';
      return ''
    }
    getErrorCp() {
      //address
      if(this.dataForm.controls['cp'].hasError('minlength')) return 'Este valor debe tener más de 2 caracteres';
      if(this.dataForm.controls['cp'].hasError('maxlength')) return 'Este valor debe tener menos de 10 caracteres';
      return ''
    }
    getErrorCity() {
      //city
      if(this.dataForm.controls['city'].hasError('required')) return 'Tenés que ingresar un valor';
      if(this.dataForm.controls['city'].hasError('minlength')) return 'Mínimo de 4 caracteres';
      if(this.dataForm.controls['city'].hasError('maxlength')) return 'Máximo de 50 caracteres';
      return ''
    }
    getErrorState() {
      //state
      if(this.dataForm.controls['state'].hasError('required')) return 'Tenés que ingresar un valor';
      if(this.dataForm.controls['state'].hasError('minlength')) return 'Mínimo de 4 caracteres';
      if(this.dataForm.controls['state'].hasError('maxlength')) return 'Máximo de 50 caracteres';
      return ''
    }
    getErrorCountry() {
      //country
      if(this.dataForm.controls['country'].hasError('required')) return 'Tenés que ingresar un valor';
      if(this.dataForm.controls['country'].hasError('minlength')) return 'Mínimo de 4 caracteres';
      if(this.dataForm.controls['country'].hasError('maxlength')) return 'Máximo de 50 caracteres';
      return ''
    }
    getErrorSchedule() {
      //schedule
      if(this.dataForm.controls['schedule'].hasError('minlength')) return 'Este valor debe tener más de 5 caracteres';
      if(this.dataForm.controls['schedule'].hasError('maxlength')) return 'Este valor debe tener menos de 100 caracteres';
      return ''
    }

    reset() {
      if(this.data) {
        this.setDataform();
      } else {
        this.dataForm.reset();
      }
    }

    onSubmit() {
      this.closeDialog(this.dataForm.value)
    }

  //Cierra la ventana de diálogo
  closeDialog(response: any): void {
    this.dialogRef.close(response);
  }

}

