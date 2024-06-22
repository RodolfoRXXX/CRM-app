import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { merge, startWith, map, switchMap, catchError, of as observableOf, firstValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Category } from 'src/app/shared/interfaces/category.interface';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { Option1 } from 'src/app/shared/interfaces/option1.interface';
import { Option2 } from 'src/app/shared/interfaces/option2.interface';
import { Product } from 'src/app/shared/interfaces/product.interface';

@Component({
  selector: 'app-product-information',
  templateUrl: './product-information.component.html',
  styleUrls: ['./product-information.component.scss']
})
export class ProductInformationComponent implements OnInit {

  @Input() product!: Product;

  id_enterprise!: number;
  sku!: string;
  employee!: Employee;
  categories!: Category[];
  option1!: Option1[];
  option2!: Option2[];
  dataForm!: FormGroup;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['name'];
  inputBoxName!:boolean;
  loading!: boolean;
  exist_sku!: string;

  constructor(
    private _conector: ConectorsService,
    private _api: ApiService,
    private _notify : NotificationService,
    private _router: Router
  ) {
    this.loading = false;
    this.inputBoxName = false;
    this.createDataForm();
  }

  ngOnInit(): void {
    this.setInitial()
  }
  async getData(): Promise<any> {
    const data = await firstValueFrom(this._conector.getEmployee());
    return data;
  }
  async setInitial(): Promise<void> {
    try {
      const value = await this.getData();
      this.getCategories(value.id_enterprise);
      this.getOption1(value.id_enterprise);
      this.getOption2(value.id_enterprise);
      this.id_enterprise = value.id_enterprise;
      this.employee = value;
      this.dataForm.patchValue({id_enterprise : value.id_enterprise})
    } catch (error) {
      console.error('Error executing functions', error);
    }
  }

  //Toma los cambios del Input de entrada y actualiza el formulario
  ngOnChanges(changes: SimpleChanges) {
    if (changes['product']) {
      this.setDataForm(changes['product'].currentValue)
    }
  }

  //Carga los select
    //Categorías
    getCategories(id_enterprise: number): void {
      this._api.postTypeRequest('profile/get-categories', { id_enterprise: id_enterprise }).subscribe( (value:any) => {
        this.categories = value.data
      })
    }
    //Color
    getOption1(id_enterprise: number): void {
      this._api.postTypeRequest('profile/get-option1', { id_enterprise: id_enterprise }).subscribe( (value:any) => {
        this.option1 = value.data
      })
    }
    //Medida
    getOption2(id_enterprise: number): void {
      this._api.postTypeRequest('profile/get-option2', { id_enterprise: id_enterprise }).subscribe( (value:any) => {
        this.option2 = value.data
      })
    }

  //Carga todas las opciones de producto
  searchAll() {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this._api.postTypeRequest('profile/get-products-listOfName', { id_enterprise: this.id_enterprise})
                        .pipe(catchError(async () => {observableOf(null)}));
        }),
        map(data => {
          return data;
        })
      )
      .subscribe((data: any) => {
        this.dataSource.data = data.data
      });
      this.inputBoxName = true;
  }
  //Filtra el listado de productos de acuerdo a lo ingresado en el input
  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  //Cuando se clickea fuera del input de nombre esta función oculta el table con los productos
  onBlur() {
    setTimeout(() => {
      this.inputBoxName = false;
    }, 100);
    
  }
  //Función que toma la fila clickeada del table eligiendo esa opción
  onRowClicked(row: any) {
    this.dataForm.patchValue({
      name: row.name,
      category: row.category
    })
  }

  //Función que verifica el SKU
  checkSKU(): void {
    if(
      (this.dataForm.controls['name'].value && !this.dataForm.controls['name']!.errors) &&
      (this.dataForm.controls['category'].value && !this.dataForm.controls['category']!.errors) &&
      (this.dataForm.controls['id_option_1'].value && !this.dataForm.controls['id_option_1']!.errors) &&
      (this.dataForm.controls['id_option_2'].value && !this.dataForm.controls['id_option_2']!.errors) && 
      (this.getSku() !== this.dataForm.controls['sku'].value)
    ) {
      this.loading = true;
      this.sku = this.getSku();
      this._api.postTypeRequest('profile/test-sku', { id_enterprise: this.id_enterprise, sku: this.sku }).subscribe( (value:any) => {
        if(value.data) {
          //Ya existe ese SKU, no se puede crear el producto
          this.exist_sku = 'yes'
        } else {
          //No existe ese SKU, se puede continuar
          this.exist_sku = 'not'
          this.dataForm.patchValue({
            sku: this.sku
          })
          this.dataForm.controls['sku'].markAsDirty
        }
        console.log(this.dataForm.value)
        this.loading = false;
      })
    }
  }
  //Función que devuelve el sku
  getSku(): string {
    return ((this.dataForm.controls['name'].value).trim().toLowerCase()).slice(0, 3) + '-' +
            (this.dataForm.controls['name'].value).trim().toLowerCase().slice(-3) + '-' +
              this.dataForm.controls['category'].value + '-' +
              this.dataForm.controls['id_option_1'].value + '-' +
              this.dataForm.controls['id_option_2'].value;
  }

  //Formulario creación/edición de producto
  createDataForm(): void {
    this.dataForm = new FormGroup({
        id: new FormControl(''),
        id_enterprise: new FormControl(''),
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(100)
        ]),
        category: new FormControl('', [
          Validators.required,
        ]),
        id_option_1: new FormControl('', [
          Validators.required,
        ]),
        id_option_2: new FormControl('', [
          Validators.required,
        ]),
        sku: new FormControl('', [
          Validators.required,
        ]),
        description: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(250)
        ])
    });
  }

  //Setea los valores del formulario si tuviera que cargarse un producto
  setDataForm(product: Product) {
    this.dataForm.setValue({
      id: (product.id > 0)?product.id:'',
      id_enterprise: (product.id_enterprise > 0)?product.id_enterprise:'',
      name: (product.name != '')?product.name:'',
      category: (product.category > 0)?product.category:'',
      id_option_1: (product.id_option_1 > 0)?product.id_option_1:'',
      id_option_2: (product.id_option_2 > 0)?product.id_option_2:'',
      sku: (product.sku != '')?product.sku:'',
      description: (product.description != '')?product.description:'',
    })
    this.sku = (product.sku != '')?product.sku:'';
  }

  //Capturador de errores del valor de formulario
  getErrorName() {
    //name
    if(this.dataForm.controls['name'].hasError('required')) return 'Tenés que ingresar un nombre';
    if(this.dataForm.controls['name'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['name'].hasError('maxlength')) return 'Este valor debe tener menos de 100 caracteres';
      return ''
  }
  getErrorCategory() {
    //category
    if(this.dataForm.controls['category'].hasError('required')) return 'Elegí una opción';
      return ''
  }
  getErrorOption1() {
    //option_1
    if(this.dataForm.controls['id_option_1'].hasError('required')) return 'Elegí una opción';
      return ''
  }
  getErrorOption2() {
    //option_2
    if(this.dataForm.controls['id_option_2'].hasError('required')) return 'Elegí una opción';
      return ''
  }
  getErrorSku() {
    //sku
    if(this.dataForm.controls['sku'].hasError('required')) return 'Tenés que generar un SKU';
    //falta error por si el SKU ya existe, es decir el producto ya existe
      return ''
  }
  getErrorDescription() {
    //description
    if(this.dataForm.controls['description'].hasError('required')) return 'Tenés que ingresar una descripción';
    if(this.dataForm.controls['description'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['description'].hasError('maxlength')) return 'Este valor debe tener menos de 250 caracteres'; 
      return ''
  }

  //Elimina todo lo que el reset básico no limpia
  resetAll() {
    this.sku = '';
    this.exist_sku = '';
    this.setDataForm(this.product)
  }

  //Navegar a la misma ruta para recargar el componente
  rechargeComponent(id_product: number = 0) {
    if(id_product > 0) {
      this._router.navigate(['init/main/product/add-product'], { queryParams: { id_product: id_product } });
    } else {
      window.location.reload();
    }
  }

  //Submit del formulario
  onSubmitUser() {
    this.loading = true;
    if(this.getSku() !== this.dataForm.controls['sku'].value) {
      //SKU diferente a las opciones elegidas
      this.exist_sku = 'regenerate';
      this.loading = false;
    } else {
      //SKU ok
      //Acá debe o crear un producto o modificar algún valor
      //Si el componente se abrió como add-product sin id de referencia de producto debería crear uno
      //Si el componente se abrió desde el listado de producto para edición, carda un id que es el del producto
      //La diferencia radica en si el id está cargado o no
      if(this.dataForm.controls['id'].value > 0) {
        //Modifica el producto
        this._api.postTypeRequest('profile/edit-product-information', this.dataForm.value).subscribe({
          next: (res: any) => {
            this.loading =  false;
            if(res.status == 1){
              //Accedió a la base de datos y no hubo problemas
              if(res.data.changedRows == 1){
                //Modificó datos empresa
                this._notify.showSuccess('Nuevo producto creado con éxito!');
                this.rechargeComponent();
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
        //Crea un producto nuevo
        this._api.postTypeRequest('profile/create-product', this.dataForm.value).subscribe({
          next: (res: any) => {
            this.loading =  false;
            if(res.status == 1){
              //Accedió a la base de datos y no hubo problemas
              if(res.data.affectedRows == 1){
                //Modificó datos empresa
                this._notify.showSuccess('Nuevo producto creado con éxito!');
                this.rechargeComponent(res.data.insertId);
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
      }
    }
  }

}
