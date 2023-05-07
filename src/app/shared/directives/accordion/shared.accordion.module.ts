import { NgModule } from '@angular/core';

import { AccordionDirective } from './accordion.directive';
import { AccordionlinkDirective } from "./accordionlink.directive";
import { AccordionanchorDirective } from './accordionanchor.directive';


@NgModule({
  declarations: [
    AccordionanchorDirective,
    AccordionlinkDirective,
    AccordionDirective
  ],
  exports: [
    AccordionanchorDirective,
    AccordionlinkDirective,
    AccordionDirective
   ],
  providers: [ ]
})
export class SharedAccordionModule { }