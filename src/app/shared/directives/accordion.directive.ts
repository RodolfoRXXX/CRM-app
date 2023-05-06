import { AfterContentChecked, Directive } from '@angular/core';
import { AccordionlinkDirective } from './accordionlink.directive';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[appAccordion]'
})
export class AccordionDirective implements AfterContentChecked {

  protected navlinks: Array<AccordionlinkDirective> = [];

  constructor(
    private _router: Router
  ) {
    setTimeout(() => this.checkOpenLinks());
  }

  closeOtherLinks(selectedLink: AccordionlinkDirective): void {
    this.navlinks.forEach((link: AccordionlinkDirective) => {
      if (link !== selectedLink) {
        link.selected = false;
      }
    })
  }

  addLink(link: AccordionlinkDirective): void {
    this.navlinks.push(link);
  }

  removeGroup(link: AccordionlinkDirective): void {
    const index = this.navlinks.indexOf(link);
    if (index !== -1) {
      this.navlinks.splice(index, 1);
    }
  }

  checkOpenLinks() {
    this.navlinks.forEach((link: AccordionlinkDirective) => {
      if (link.group) {
        const routeUrl = this._router.url;
        const currentUrl = routeUrl.split('/');
        if (currentUrl.indexOf(link.group) > 0) {
          link.selected = true;
          this.closeOtherLinks(link);
        }
      }
    });
  }

  ngAfterContentChecked(): void {
    this._router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(e => this.checkOpenLinks());
  }

}
