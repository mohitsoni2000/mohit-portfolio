import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollToggle]',
  standalone: true
})
export class ScrollToggleDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (offset >= 10) {
      this.renderer.removeClass(this.el.nativeElement, 'bix-static');
      this.renderer.addClass(this.el.nativeElement, 'bix-fixed');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'bix-fixed');
      this.renderer.addClass(this.el.nativeElement, 'bix-static');
    }
  }
}
