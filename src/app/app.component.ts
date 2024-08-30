import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  HostListener,
  NO_ERRORS_SCHEMA,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './shared/loader/loader.component';
import * as AOS from 'aos';
import { ScrollToggleDirective } from './shared/directive/scroll-toggle.directive';
import { ResponsiveMenuComponent } from './shared/responsive-menu/responsive-menu.component';
import mixitup from 'mixitup';
import Swiper from 'swiper';
import LocomotiveScroll from 'locomotive-scroll';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  imports: [
    RouterOutlet,
    LoaderComponent,
    ScrollToggleDirective,
    ResponsiveMenuComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private mediaQueryListener: (() => void) | undefined;
  private mixer: any;
  currentYear: string;

  pathLength: number;
  bixprogressPath: SVGPathElement | null;
  progressElements: NodeListOf<HTMLElement> | undefined;
  isProgressInitialized: boolean = false;
  maxStrokeOffset: number = -219.99078369140625;

  private scrollInstance: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.pathLength = 0;
    this.bixprogressPath = null;
    this.currentYear = new Date().getFullYear().toString();
  }

  ngOnInit(): void {
    AOS.init();

    this.initProgressPath();
    this.updateProgress();
    this.progressElements = document.querySelectorAll('.progress');
  }

  openMenu(): void {
    const overlay = document.querySelector(
      '.bix-sidebar-overlay'
    ) as HTMLElement;
    const menu = document.querySelector('.bix-mobile-menu') as HTMLElement;

    if (overlay && menu) {
      this.renderer.setStyle(overlay, 'display', 'block');
      this.renderer.addClass(menu, 'bix-menu-open');
    }
  }

  ngAfterViewInit(): void {
    this.initializeSwiper();
    this.setupParallaxEffect();
    this.initializeMixItUp();
    this.scrollInstance = new LocomotiveScroll({
      el: document.querySelector('#your-container') as HTMLElement | undefined,
      smooth: true,
    });
  }

  private setupParallaxEffect(): void {
    const mediaQuery = window.matchMedia('only screen and (min-width: 991px)');

    if (mediaQuery.matches) {
      const handleMouseMove = (e: MouseEvent) => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const offsetX = 0.5 - e.pageX / w;
        const offsetY = 0.5 - e.pageY / h;

        const elements = this.el.nativeElement.querySelectorAll(
          '.hero-parallax'
        ) as NodeListOf<HTMLElement>;
        elements.forEach((el: HTMLElement) => {
          const offset = parseInt(el.getAttribute('data-offset') || '0', 10);
          const translate = `translate3d(${Math.round(
            offsetX * offset
          )}px, ${Math.round(offsetY * offset)}px, 0px)`;

          this.renderer.setStyle(el, 'transform', translate);
          this.renderer.setStyle(el, '-webkit-transform', translate);
          this.renderer.setStyle(el, '-moz-transform', translate);
        });
      };

      this.renderer.listen('window', 'mousemove', handleMouseMove);
      this.mediaQueryListener = () => mediaQuery.removeListener(() => {});
    }
  }

  private initializeMixItUp(): void {
    const container = this.el.nativeElement.querySelector('.item-grid');
    if (container) {
      this.mixer = mixitup(container, {
        selectors: {
          target: '.item',
        },
        load: {
          filter: 'all',
        },
      });
    }
  }

  private initializeSwiper(): void {
    new Swiper('.testimonials-slider', {
      loop: true,
      spaceBetween: 24,
      slidesPerView: 1,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

    /* Blog */
    new Swiper('.bix-blog-wrap', {
      loop: true,
      spaceBetween: 24,
      slidesPerView: 1,
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.handleSkillProgress();
    this.toggleBackToTop();
    this.updateProgress();
  }

  private initProgressPath(): void {
    this.bixprogressPath = document.querySelector('.back-to-top-wrap path');
    if (this.bixprogressPath) {
      this.pathLength = this.bixprogressPath.getTotalLength();
      this.bixprogressPath.style.transition = 'none';
      this.bixprogressPath.style.strokeDasharray = `${this.pathLength} ${this.pathLength}`;
      this.bixprogressPath.style.strokeDashoffset = `${this.pathLength}`;
      this.bixprogressPath.getBoundingClientRect();
      this.bixprogressPath.style.transition = 'stroke-dashoffset 10ms linear';
    }
  }

  private updateProgress(): void {
    if (this.bixprogressPath) {
      const scroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = this.pathLength - (scroll * this.pathLength) / height;
      this.bixprogressPath.style.strokeDashoffset = `${progress}`;
    }
  }

  private toggleBackToTop(): void {
    const backToTop = document.querySelector('.back-to-top') as HTMLElement;
    const backToTopWrap = document.querySelector(
      '.back-to-top-wrap'
    ) as HTMLElement;
    const scrollPosition = window.scrollY;

    if (scrollPosition > 50) {
      backToTop.style.display = 'block';
    } else {
      backToTop.style.display = 'none';
    }

    if (scrollPosition > 50) {
      backToTopWrap.classList.add('active-progress');
    } else {
      backToTopWrap.classList.remove('active-progress');
    }
  }

  scrollToTop(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private handleSkillProgress(): void {
    const progressContainer = document.getElementById('progress');
    if (progressContainer && !this.isProgressInitialized) {
      const windowScrollTop = window.scrollY;
      const offsetTop = progressContainer.offsetTop - window.innerHeight;

      if (windowScrollTop > offsetTop) {
        this.progressElements?.forEach((element: HTMLElement) => {
          const percent = element.getAttribute('data-progress');
          const fillElement = element.querySelector('.fill') as HTMLElement;
          const valueElement = element.querySelector('.value') as HTMLElement;

          if (fillElement && percent) {
            fillElement.style.strokeDashoffset = `${
              ((100 - parseInt(percent)) / 100) * this.maxStrokeOffset
            }`;
          }

          if (valueElement && percent) {
            valueElement.innerHTML = `${percent}%`;
          }
        });

        this.isProgressInitialized = true;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.mediaQueryListener) {
      this.mediaQueryListener();
    }
    if (this.scrollInstance) {
      this.scrollInstance.destroy();
    }
  }
}
