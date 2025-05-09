import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-loader.component.html',
  styleUrl: './chart-loader.component.css'
})
export class ChartLoaderComponent {
  @Input() size: number = 90;
  @Input() type: 'doughnut' | 'wavyLinesChart' = 'doughnut';
  @Input() fullSize = false;


  ngAfterViewInit() {
    if (this.type === 'wavyLinesChart') {
      this.animateWaves();
    }
  }

  animateWaves() {
    const wave1 = document.querySelector('.wave1') as SVGPathElement;
    const wave2 = document.querySelector('.wave2') as SVGPathElement;

    if (wave1 && wave2) {
      let offset = 0;

      const draw = () => {
        offset += 0.05;

        const d1 = this.generateWavePath(0, offset);
        const d2 = this.generateWavePath(0.5, offset + 1);

        wave1.setAttribute('d', d1);
        wave2.setAttribute('d', d2);

        requestAnimationFrame(draw);
      };

      draw();
    }
  }

  generateWavePath(phase: number, offset: number): string {
    const points = [];
    const amplitude = 10;
    const frequency = 2;
    const width = 200;
    const height = 50;

    for (let x = 0; x <= width; x++) {
      const y =
        height +
        Math.sin((x / width) * frequency * 2 * Math.PI + offset + phase) *
        amplitude;
      points.push(`${x},${y}`);
    }

    return `M${points.join(' L')}`;
  }
}
