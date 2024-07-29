import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-dialog-order-edit-observation',
  templateUrl: './dialog-order-edit-observation.component.html',
  styleUrls: ['./dialog-order-edit-observation.component.scss'],
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class DialogOrderEditObservationComponent implements OnInit {

  dataForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogOrderEditObservationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _auth: AuthService
  ) {
    this.createDataForm()
  }
  ngOnInit(): void {
    if(this.data) {
      this.setDataform();
    }
  }

  //Edita datos de envío
  createDataForm() {
    this.dataForm = new FormGroup({
      observation: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(250)
      ])
    })
  }

  //Setea los valores del formulario en caso de que los hubiera
  setDataform() {
    this.dataForm.setValue({
      observation: (this.data.observation)?this.data.observation:''
    })
  }

    //Mensajes de error
    getErrorObservation() {
      //observation
      if(this.dataForm.controls['observation'].hasError('required')) return 'Tenés que ingresar un texto';
      if(this.dataForm.controls['observation'].hasError('minlength')) return 'Este valor debe tener más de 5 caracteres';
      if(this.dataForm.controls['observation'].hasError('maxlength')) return 'Este valor debe tener menos de 250 caracteres';
      return ''
    }

  //Resetea el formulario
  reset() {
    if(this.data) {
      this.setDataform();
    } else {
      this.dataForm.reset();
    }
  }

  //Envia el mensaje
  onSubmit() {
    this.closeDialog(this.dataForm.controls['observation'].value)
  }

  //Cierra la ventana de diálogo
  closeDialog(response: any): void {
    this.dialogRef.close(response);
  }

}

