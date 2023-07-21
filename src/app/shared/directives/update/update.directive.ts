import { Directive, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[update]'
})
export class UpdateDirective implements OnChanges {

  @Input() update!: boolean;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) { 
    this.viewContainerRef.createEmbeddedView( templateRef )
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['update']) {
      this.viewContainerRef.clear();
      this.viewContainerRef.createEmbeddedView( this.templateRef );
    }
  }

}
