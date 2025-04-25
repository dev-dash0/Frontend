import { Component } from '@angular/core';

@Component({
  selector: 'app-flip-card',
  standalone: true,
  templateUrl: './flip-card.component.html',
  styleUrls: ['./flip-card.component.css'],
})
export class FlipCardComponent {
  currentCardIndex = 0;
  cards = [
    {
      title: 'Card One',
      frontContent: 'Front of Card One',
      backContent: 'This is the back of Card One with more info.',
    },
    {
      title: 'Card Two',
      frontContent: 'Front of Card Two',
      backContent: 'Back of Card Two details here.',
    },
    {
      title: 'Card Three',
      frontContent: 'Front of Card Three',
      backContent: 'More detail on the back of Card Three.',
    },
  ];

  flipped = false;

  flipCard() {
    this.flipped = !this.flipped;
  }

  nextCard() {
    this.currentCardIndex = (this.currentCardIndex + 1) % this.cards.length;
    this.flipped = false;
  }

  prevCard() {
    this.currentCardIndex =
      (this.currentCardIndex - 1 + this.cards.length) % this.cards.length;
    this.flipped = false;
  }
}
