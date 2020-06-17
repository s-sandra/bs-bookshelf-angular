import { Component, Input, OnInit } from '@angular/core';
import { AppBook } from '../books.service';

 /**
  * Decorator to tell Angular this is a component.
  * Contains JS object that sets up component metadata.
  */
@Component({
    selector: 'app-book',  // the selector to use component
    templateUrl: './book.component.html', // the html template
    styleUrls: ['./book.component.scss']
})

export class BookComponent implements OnInit {
  @Input() metadata: AppBook;
  overflow: boolean;  // whether book title is longer than 50 chars
  title: string;
  toggled: boolean;  // whether the book title is truncated

  constructor(){}

  ngOnInit(): void {
    this.title = this.metadata.title;
    this.toggled = false;
    this.overflow = this.title.length > 50;
    if (this.overflow) {
      this.hideOverflow();
    }
  }

  /**
   * Shows overflowing characters of book title.
   */
  showOverflow(): void {
    this.toggled = false;
    this.title = this.metadata.title;
  }

  /**
   * Toggles overflowing characters of book title.
   */
  hideOverflow(): void {
    this.toggled = true;
    this.title = this.title.slice(0, 50);
  }
}
