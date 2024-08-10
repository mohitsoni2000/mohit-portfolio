import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-responsive-menu',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: ` <!-- Mobile-menu -->
  <div class="bix-sidebar-overlay" (click)="closeMenu()"></div>
  <div id="in_mobile_menu" class="bix-side-cart bix-mobile-menu">
      <div class="bix-menu-title">
          <div class="menu-title">
              <h4>Menu</h4>
          </div>
          <button type="button" class="bix-close"  (click)="closeMenu()">×</button>
      </div>
      <div class="bix-menu-inner">
          <div class="bix-menu-content">
              <ul class="bix-menu mobile-menu">
                  <li class="nav-item">
                      <a class="nav-link" href="#home">Home</a>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link" href="#about">About</a>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link" href="#bixexperience">Experience</a>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link" href="#services">Services</a>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link" href="#projects">projects</a>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link" href="#testimonial">Testimonial</a>
                  </li>
              </ul>
          </div>
      </div>
  </div>`,
  styleUrl: './responsive-menu.component.css',
})
export class ResponsiveMenuComponent {
  private lastId: string | undefined;
  private topMenu: HTMLElement | null = null;
  private topMenuHeight: number = 0;
  private menuItems: NodeListOf<HTMLAnchorElement> | null = null;
  private scrollItems: HTMLElement[] = [];

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.initializeMenu();
    this.setupScrollHandler();
  }

  private initializeMenu(): void {
    this.topMenu = this.el.nativeElement.querySelector('.bix-menu') as HTMLElement;
    if (this.topMenu) {
      this.topMenuHeight = this.topMenu.offsetHeight + 15;
      this.menuItems = this.topMenu.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
      this.scrollItems = Array.from(this.menuItems).map(menuItem => {
        const href = menuItem.getAttribute('href');
        return href ? document.querySelector(href) as HTMLElement : null;
      }).filter(item => item !== null) as HTMLElement[];
    }

    this.menuItems?.forEach(menuItem => {
      this.renderer.listen(menuItem, 'click', (e: Event) => {
        e.preventDefault();
        const targetHref = (e.target as HTMLAnchorElement).getAttribute('href') || '#';
        const targetElement = document.querySelector(targetHref) as HTMLElement;

        if (targetElement) {
          const offsetTop = targetHref === '#' ? 0 : targetElement.offsetTop - this.topMenuHeight + 1;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  private setupScrollHandler(): void {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const fromTop = scrollTop + this.topMenuHeight;

      const cur = this.scrollItems.map(item => {
        if (item.offsetTop < fromTop) return item;
        return null;
      }).filter(item => item !== null) as HTMLElement[];

      const currentElement = cur[cur.length - 1];
      const id = currentElement?.id || '';

      if (this.lastId !== id) {
        this.lastId = id;
        this.menuItems?.forEach(menuItem => {
          const href = menuItem.getAttribute('href') || '';
          const parent = menuItem.parentElement;
          if (parent) {
            this.renderer.removeClass(parent, 'active');
          }
          if (href === `#${id}` && parent) {
            this.renderer.addClass(parent, 'active');
          }
        });
      }
    });
  }

  closeMenu(): void {
    const overlay = document.querySelector('.bix-sidebar-overlay') as HTMLElement;
    const menu = document.querySelector('.bix-mobile-menu') as HTMLElement;

    if (overlay && menu) {
      this.renderer.setStyle(overlay, 'display', 'none');
      this.renderer.removeClass(menu, 'bix-menu-open');
    }
  }
}
