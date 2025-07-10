import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { Application } from '@splinetool/runtime';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-welcome2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome2.component.html',
  styleUrl: './welcome2.component.css',
})
export class Welcome2Component implements AfterViewInit {
  showContent = false;
  isTransitioning = false;
  private firstApp!: Application;
  private secondApp!: Application;
  private preloadDone = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}


  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const canvas1 = document.getElementById(
      'spline-canvas-1'
    ) as HTMLCanvasElement;
    this.firstApp = new Application(canvas1);

      this.firstApp
        .load('https://prod.spline.design/bUbWPXg9-mlFAu0Z/scene.splinecode')
        .then(() => {
          this.firstApp.play();

          setTimeout(() => {
            this.firstApp.stop();
            this.showContent = true;

            setTimeout(() => this.preloadSecondScene(), 2000);
          }, 13000);
        });
    }

  preloadSecondScene(): void {
    if (!isPlatformBrowser(this.platformId) || this.preloadDone) return;

    const canvas2 = document.getElementById(
      'spline-canvas-2'
    ) as HTMLCanvasElement;
    this.secondApp = new Application(canvas2);

    this.secondApp
      .load('https://prod.spline.design/mdeJCKXnwavPqilE/scene.splinecode') // Replace with your second scene
      .then(() => {
        this.preloadDone = true;
        // Scene is ready to play immediately on explore click
      });
  }

  onExploreClick(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.showContent = false;
    this.isTransitioning = true;

    const canvas1 = document.getElementById(
      'spline-canvas-1'
    ) as HTMLCanvasElement;
    const canvas2 = document.getElementById(
      'spline-canvas-2'
    ) as HTMLCanvasElement;
    const fadeCover = document.getElementById('fade-cover') as HTMLDivElement;

    // 1. Fade in black cover
    fadeCover.classList.add('visible');

    // 2. After short delay, swap canvases
    setTimeout(() => {
      canvas1.classList.remove('visible');
      canvas2.classList.add('visible');

      // 3. Fade out black cover
      fadeCover.classList.remove('visible');

      // 4. Play second animation
      this.secondApp.play();

      setTimeout(() => {
        this.router.navigate(['/MyDashboard']);
      }, 5000); // Match animation length
    }, 1000); // Delay during black fade
  }
}
