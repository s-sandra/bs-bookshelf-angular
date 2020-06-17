import { Component } from '@angular/core';
import { BooksService, AppBook } from '../books.service';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent {

  searchPhrase: string;
  searchResult: AppBook[];
  loading: boolean;
  isbn: string;

  constructor(
    private googleBooks: BooksService,
    public firebase: FirebaseService) {
    this.searchPhrase = null;
    this.searchResult = [];
    this.loading = false;
    this.isbn = null;
  }

  /**
   * Saves search results for Google Books search by title.
   * @param phrase the book title to search for.
   */
  onSearch(phrase: string): void {
    this.searchPhrase = phrase;
    this.isbn = null;
    if (this.searchPhrase) {
      this.loading = true;
      this.searchResult = [];
      this.googleBooks.searchTitle(this.searchPhrase)
        .subscribe(books => {
          this.searchResult = books;
          this.loading = false;
        });
    }
  }

  /**
   * Saves search result of Google Books search by ISBN.
   * @param isbn the ISBN of the book to search for.
   */
  onScan(isbn: string): void {
    this.loading = true;
    this.isbn = isbn;
    this.searchResult = [];
    this.googleBooks.searchISBN(isbn)
      .subscribe(books => {
        this.searchResult = books;
        this.loading = false;
      });
  }
}
