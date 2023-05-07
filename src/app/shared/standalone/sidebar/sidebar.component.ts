import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { RouterModule } from '@angular/router';
import { MenuSettings } from '../../menu-items/menu-settings';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [
    RouterModule,
    MaterialModule,
    CommonModule
  ],
  providers: [
    MenuSettings
  ]
})
export class SidebarComponent {

  constructor(
    public menuSettings: MenuSettings
  ) {}

}
