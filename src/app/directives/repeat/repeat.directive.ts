import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface RepeatContext {
  index: number;
}

@Directive({
  selector: '[appRepeat]',
})
export class RepeatDirective {
  @Input() set appRepeat(count: number) {
    this.viewContainer.clear();
    for (let i = 0; i < count; i++) {
      this.viewContainer.createEmbeddedView(this.templateRef, {
        index: i + 1,
      });
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  static ngTemplateContextGuard(
    directive: RepeatDirective,
    context: unknown
  ): context is RepeatContext {
    return true;
  }
}
