import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DialogComponent } from 'src/app/shared/standalone/dialog/dialog.component';
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-enterprise-data',
  templateUrl: './enterprise-data.component.html'
})
export class EnterpriseDataComponent implements OnInit {

  userDataForm!: FormGroup;
  base_image!: string;
  name_image!: string;
  state: any = {
    id: 0,
    enterprise: ''
  }
  disable_submit!: boolean;
  loading!: boolean;
  load!: boolean;

  constructor(
    private _auth: AuthService,
    private _api: ApiService,
    private _notify: NotificationService,
    private _conector: ConectorsService,
    public dialog: MatDialog
  ) { 
    this.disable_submit = false;
    this.loading = false;
    this.load = true;
    this.setDataUser();
   }

  ngOnInit(): void {
    this.createUserForm();
  }

  async getDataUser(): Promise<any> {
    const data = await JSON.parse(this._auth.getDataFromLocalStorage());
    return data;
  }

  setDataUser() {
    this.getDataUser()
        .then( data => {
          this.state.enterprise = data.enterprise;
          this._api.getTypeRequest('user/get-enterprises').subscribe({
            next: (res: any) => {
              this.load = false;
              if(res.status == 1){
                //Accedió a la base de datos y no hubo problemas
                if(res.data.length) {
                  const result = res.data.find( (value:any) => value.name == this.state.enterprise);
                  this.name_image = result.thumbnail;
                  this.base_image = environment.SERVER + this.name_image;
                  this.state.thumbnail = result.thumbnail;
                  this.state.id = result.id;
                  if(result.thumbnail != 'blanck_enterprise.png') {
                    this.state.blanck = false;
                  }
                  this.userDataForm.patchValue({
                    id: result.id
                  })
                  this.setFormValue(result);
                } else {
                  this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
                }
              } else{
                  //Problemas de conexión con la base de datos(res.status == 0)
                  this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
              }
            },
            error: (error) => {
              //Error de conexión, no pudo consultar con la base de datos
              this.load = false;
              this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
            }
          })
        })
  }

  setFormValue(data: any) {
    this.userDataForm.controls['name'].setValue(data.name);
    this.userDataForm.controls['cuit'].setValue(data.cuit);
    this.userDataForm.controls['address'].setValue(data.address);
    this.userDataForm.controls['cp'].setValue(data.cp);
    this.userDataForm.controls['phone_1'].setValue(data.phone_1);
    this.userDataForm.controls['phone_2'].setValue(data.phone_2);
    this.userDataForm.controls['city'].setValue(data.city);
    this.userDataForm.controls['state'].setValue(data.state);
    this.userDataForm.controls['country'].setValue(data.country);
  }

  createUserForm(): void {
    this.userDataForm = new FormGroup({
        id: new FormControl(''),
        name : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30)
        ]),
        cuit : new FormControl('', [
          Validators.minLength(4),
          Validators.maxLength(30)
        ]),
        address : new FormControl('', [
          Validators.minLength(4),
          Validators.maxLength(30)
        ]),
        cp : new FormControl('', [
          Validators.minLength(4),
          Validators.maxLength(30)
        ]),
        phone_1 : new FormControl('', [
          Validators.minLength(4),
          Validators.maxLength(15)
        ]),
        phone_2 : new FormControl('', [
          Validators.minLength(4),
          Validators.maxLength(15)
        ]),
        city : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15)
        ]),
        state : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15)
        ]),
        country : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15)
        ]),
    });
  }

  getNameErrorMessage() {
    if(this.userDataForm.controls['name'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.userDataForm.controls['name'].hasError('minlength')) {
      return 'Este valor debe tener más de 4 caracteres'}
    if(this.userDataForm.controls['name'].hasError('maxlength')) {
      return 'Este valor debe tener menos de 30 caracteres'}
    return ''
  }
  getAddressErrorMessage() {
    if(this.userDataForm.controls['address'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.userDataForm.controls['address'].hasError('minlength')) {
      return 'Este valor debe tener más de 4 caracteres'}
    if(this.userDataForm.controls['address'].hasError('maxlength')) {
      return 'Este valor debe tener menos de 30 caracteres'}
    return ''
  }
  getPhoneErrorMessage() {
    if(this.userDataForm.controls['phone'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.userDataForm.controls['phone'].hasError('minlength')) {
      return 'Este valor debe tener más de 4 caracteres'}
    if(this.userDataForm.controls['phone'].hasError('maxlength')) {
      return 'Este valor debe tener menos de 15 caracteres'}
    return ''
  }
  getDateErrorMessage() {
    if(this.userDataForm.controls['date'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    return ''
  }
  getWorkHourErrorMessage() {

  }
  getNameErErrorMessage() {

  }
  getPhoneErErrorMessage() {

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { 
        id: this.state.id,
        enterprise: this.state.enterprise,
        blanck: this.state.blanck,
        thumbnail: this.state.thumbnail
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        window.location.reload();
      }
    });
  }  

  onSubmitUser() {
    this.disable_submit = true;
    this.loading =  true;
    this._api.postTypeRequest('profile/update-enterprise', this.userDataForm.value).subscribe({
      next: (res: any) => {
        this.loading =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.data.changedRows == 1){
            //Modificó el usuario
            this._notify.showSuccess('Información actualizada con éxito!');
          } else{
            //No hubo modificación
            this.disable_submit = false;
            this._notify.showError('No se detectaron cambios. Ingresá valores diferentes a los actuales.')
          }
          setTimeout(() => {
            this._conector.setUpdate(true);
          }, 2000);
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this.disable_submit = false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      },
      error: (error) => {
        //Error de conexión, no pudo consultar con la base de datos
        this.disable_submit = false;
        this.loading =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
      }
    })
  }

}
