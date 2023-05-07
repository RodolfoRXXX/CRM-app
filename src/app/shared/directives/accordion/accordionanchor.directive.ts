import { Directive, HostListener, Inject } from '@angular/core';
import { AccordionlinkDirective } from "./accordionlink.directive";

@Directive({
  selector: '[appAccordionToggle]'
})
export class AccordionanchorDirective {

  protected navlink!: AccordionlinkDirective;

  constructor(
    @Inject(AccordionlinkDirective) navlink: AccordionlinkDirective
  ) {
    this.navlink = navlink;
  }

  @HostListener('click', ['$event'])
  onClick(e: any) {
    this.navlink.toggle();
  }

}
