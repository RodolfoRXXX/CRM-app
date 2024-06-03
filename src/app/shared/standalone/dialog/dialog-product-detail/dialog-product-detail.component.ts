import { Component, Inject, OnInit} from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  standalone: true,
  selector: 'app-dialog-product-detail',
  templateUrl: './dialog-product-detail.component.html',
  styleUrls: ['./dialog-product-detail.component.scss'],
  imports: [
    MaterialModule,
    CommonModule
  ]
})
export class DialogProductDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogProductDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _api: ApiService,
    private _auth: AuthService,
  ) {
    //this.setDataUser();
    console.log(this.data)
  }

  ngOnInit(): void {
    this._api.postTypeRequest('profile/get-product-detail', { id_product: this.data.id_product }).subscribe( (value:any) => {
      console.log(value)
    })
  }

  async getDataLocal(): Promise<any> {
    const data = JSON.parse(this._auth.getDataFromLocalStorage());
    return data.id_enterprise;
  }

  setDataUser() {
    this.getDataLocal()
        .then( id_enterprise => {
          
        })
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

}
