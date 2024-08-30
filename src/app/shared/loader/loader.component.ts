import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `    <!-- Loader -->
  <div class="bix-loader" *ngIf="isLoading">
    <span class="loader"></span>
    <img src="assets/img/logo/icon.png" alt="logo">
</div>
`,
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  isLoading = true;

  ngOnInit(): void {
    window.addEventListener('load', () => {
      this.hideLoader();
    });
  }

  hideLoader(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 600); // Simulates the "slow" fadeOut in jQuery
  }
}