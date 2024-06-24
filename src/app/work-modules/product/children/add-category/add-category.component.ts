import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Category } from 'src/app/shared/interfaces/category.interface';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  id_enterprise!: number;
  category!: Category;
  dataForm!: FormGroup;
  id_category!: number;
  loading!: boolean;
  color_badge: any;

  constructor(
    private route: ActivatedRoute,
    private _conector: ConectorsService,
    private _api: ApiService,
    private _notify : NotificationService,
    private _router: Router
  ) {
    this.loading = false;
    this.createDataForm();
  }

  ngOnInit(): void {
    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Edición de categorías')
    this.route.queryParams.subscribe(params => {
      this.id_category = params['id_category'];
      if(this.id_category) {
        this.getCategory(this.id_category)
      } else {
        this._conector.getEmployee().subscribe( value => {
          this.id_enterprise = value.id_enterprise;
          this.dataForm.patchValue({id_enterprise: this.id_enterprise})
        })
      }
    });
  }

  getCategory(id_category: number): void {
    this._api.postTypeRequest('profile/get-category-id', { id_category: id_category }).subscribe( (value:any) => {
      if(value.data) {
        //Se encontró el producto y lo paso al componente hijo
        this.category = value.data[0];
        this.setDataForm(this.category);
      }
    })
  }

  //Formulario creación/edición de la categoría
  createDataForm(): void {
    this.dataForm = new FormGroup({
        id: new FormControl(''),
        id_enterprise: new FormControl('', [
          Validators.required
        ]),
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20)
        ]),
        color_badge: new FormControl(''),
        color: new FormControl('', [
          Validators.required,
        ])
    });
  }

  //Setea los valores del formulario si tuviera que cargarse un producto
  setDataForm(category: Category) {
    this.dataForm.setValue({
      id: (category.id > 0)?category.id:'',
      id_enterprise: (category.id_enterprise > 0)?category.id_enterprise:'',
      name: (category.name != '')?category.name:'',
      color_badge: (category.color_badge != '')?category.color_badge:'',
      color: (category.color_badge != '')?JSON.parse(category.color_badge).color:''
    })
  }

  //Capturador de errores del valor de formulario
  getErrorName() {
    //name
    if(this.dataForm.controls['name'].hasError('required')) return 'Tenés que ingresar un nombre';
    if(this.dataForm.controls['name'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['name'].hasError('maxlength')) return 'Este valor debe tener menos de 20 caracteres';
      return ''
  }
  getErrorColor() {
    //name
    if(this.dataForm.controls['color_badge'].hasError('required')) return 'Tenés que ingresar un color';
      return ''
  }

  //Elimina todo lo que el reset básico no limpia
  resetAll() {
    if(this.category) {
      this.setDataForm(this.category)
    } else {
      this.dataForm.reset()
      this.dataForm.patchValue({id_enterprise: this.id_enterprise})
    }
    
  }

  //Función que pasa un color de hexadecimal a RGBA
  hexToRgba(hex: string, alpha: number = 0.2): string {
    // Eliminar el '#' inicial si está presente
    hex = hex.replace(/^#/, '');
    // Convertir valores cortos (e.g., #03F) a completos (e.g., #0033FF)
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    // Extraer los valores RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    // Devolver el valor rgba
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  onSubmit() {
    this.loading =  true;
    this.color_badge = {
      color: this.dataForm.controls['color'].value,
      bgColor: this.hexToRgba(this.dataForm.controls['color'].value)
    }
    this.dataForm.patchValue({color_badge: JSON.stringify(this.color_badge)})
    if(this.dataForm.controls['id'].value > 0) {
      //Modifica el producto
      this._api.postTypeRequest('profile/edit-category', this.dataForm.value).subscribe({
        next: (res: any) => {
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.data.changedRows == 1){
              //Modificó datos empresa
              this._notify.showSuccess('La categoría se modificó con éxito!');
              setTimeout(() => {
                this._router.navigate(['init/main/product/category']);
              }, 2000);
            } else{
              //No hubo modificación
              this._notify.showError('No se detectaron cambios. Ingresá valores diferentes a los actuales.')
            }
          } else{
            //Problemas de conexión con la base de datos(res.status == 0)
            this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
          }
        },
        error: (error: any) => {
          //Error de conexión, no pudo consultar con la base de datos
          this.loading =  false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      })      
    } else {
      //Crea una categoría nueva  DEBE VERIFICAR QUE LA CATEGORIA A AGREGAR NO EXISTA!!!
      this._api.postTypeRequest('profile/create-category', this.dataForm.value).subscribe({
        next: (res: any) => {
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.data.affectedRows == 1){
              //Modificó datos empresa
              this._notify.showSuccess('Nueva categoría creada con éxito!');
              setTimeout(() => {
                this._router.navigate(['init/main/product/category']);
              }, 2000);
            } else{
              //Ya existe dicha categoría
              this._notify.showWarn('La categoría que intentas crear ya existe.')
            }
          } else{
            //Problemas de conexión con la base de datos(res.status == 0)
            this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
          }
        },
        error: (error: any) => {
          //Error de conexión, no pudo consultar con la base de datos
          this.loading =  false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      })
    }
  }

}
