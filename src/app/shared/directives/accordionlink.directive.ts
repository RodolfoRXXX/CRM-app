import { Directive, HostBinding, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AccordionDirective } from './accordion.directive';

@Directive({
  selector: '[appAccordionlink]'
})
export class AccordionlinkDirective implements OnInit, OnDestroy {

  protected _selected: boolean = false;
  protected nav!: AccordionDirective;

  @Input() public group: any;
  @HostBinding('class.selected')
  @Input() get selected(): boolean {
    return this._selected;
  }


  set selected(value: boolean) {
    this._selected = value;
    if (value) {
      this.nav.closeOtherLinks(this);
    }
  }

  constructor(
    @Inject(AccordionDirective) nav: AccordionDirective
  ) { 
    this.nav = nav;
   }

  ngOnInit(): any {
    this.nav.addLink(this);
  }

  ngOnDestroy(): any {
    this.nav.removeGroup(this);
  }

  toggle(): any {
    this.selected = !this.selected;
  }
  

}
