import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stars',
  template: `
  <span *ngFor="let star of stars">
    <mat-icon>{{ star }}</mat-icon>
  </span>
  `,
  styleUrls: ['./stars.component.scss']
})
export class StarsComponent implements OnInit {
  @Input() rating: number;
  stars: string[];

  constructor() {
    // starts rating with zero stars (all unfilled)
    this.stars = new Array(5).fill('star_border');
  }

  ngOnInit(): void {
    for (let star = 0; star < this.rating; star++) {
      this.stars[star] = 'star';  // fills star for each rating point
    }

    // adds half-star if rating ends in 0.5
    if (this.rating - Math.floor(this.rating) === 0.5) {
      this.stars[Math.floor(this.rating)] = 'star_half';
    }
  }
}
