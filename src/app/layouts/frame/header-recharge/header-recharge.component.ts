import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-recharge',
  templateUrl: './header-recharge.component.html'
})
export class HeaderRechargeComponent {

  @Input() screenLarge: boolean = true;

}
