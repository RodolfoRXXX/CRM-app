import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-login',
  templateUrl: './header-login.component.html'
})
export class HeaderLoginComponent {

  @Input() screenLarge: boolean = true;

}
