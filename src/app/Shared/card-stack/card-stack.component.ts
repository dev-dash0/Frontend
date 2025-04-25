import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-card-stack',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './card-stack.component.html',
  styleUrl: './card-stack.component.css',
})
export class CardStackComponent {
  // cards = [
  //   { title: 'Card 1' },
  //   { title: 'Card 2' },
  //   { title: 'Card 3' },
  // ];

  // currentIndex = 0;
  // animating = false;

  // get visibleCards() {
  //   const len = this.cards.length;
  //   return [0, 1, 2].map((i) => this.cards[(this.currentIndex + i) % len]);
  // }

  // nextCard() {
  //   if (this.animating) return;
  //   this.animating = true;

  //   setTimeout(() => {
  //     this.currentIndex = (this.currentIndex + 1) % this.cards.length;
  //     this.animating = false;
  //   }, 500); // Match animation duration
  // }

  @Input() cards: any[] = [];
  @ContentChild('cardContent', { static: false })
  cardContentTemplate!: TemplateRef<any>;

  currentIndex = 0;
  animating = false;
  // Add a color palette
  cardColors: string[] = [
    '#ff6f61',
    '#6a67ce',
    '#20c997',
    '#fd7e14',
    '#17a2b8',
  ];

  getCardColor(index: number): string {
    return this.cardColors[index % this.cardColors.length];
  }

  get visibleCards() {
    const len = this.cards.length;
    return [0, 1, 2].map((i) => {
      const index = (this.currentIndex + i) % len;
      return {
        data: this.cards[index],
        index,
      };
    });
  }
  

  nextCard() {
    if (this.animating) return;
    this.animating = true;

    setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % this.cards.length;
      this.animating = false;
    }, 500);
  }

  trackByIndex(index: number, item: any): number {
    return item.index;
  }
}
