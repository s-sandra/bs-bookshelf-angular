import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { BooksService, AppBook } from '../books.service';
import { BooksComponent } from '../books/books.component';
import { PopupService } from '../popup.service';

@Component({
  selector: 'app-bookshelf',
  templateUrl: './bookshelf.component.html'
})
export class BookshelfComponent implements OnInit {

  books: AppBook[];  // books in Google bookshelf
  loading: boolean;  // whether books are being loaded
  @ViewChild(BooksComponent) shelf: BooksComponent;  // access Books function

  constructor(
    public firebase: FirebaseService,
    private popup: PopupService,
    private googleBooks: BooksService) {
      this.loading = false;
    }

  ngOnInit(): void {
    // load bookshelf if access token not expired
    if (!this.firebase.isExpired()) {
      this.loading = true;
      this.googleBooks.getBookshelf()
      .subscribe( books => {
        this.loading = false;
        this.books = books;
      });
    }
  }

  /**
   * Searches book by isbn code and adds to bookshelf
   * if found.
   * @param isbn the isbn code of book to add.
   */
  onScan(isbn: string): void {
    this.loading = true;
    this.googleBooks.searchISBN(isbn)
      .subscribe(book => {
        this.loading = false;

        // if at least one book found.
        if (book.length > 0) {
          this.shelf.saveBook(book[0]);  // add first book to shelf.
        }
        else {
          this.popup.error(`Unable to find book with ISBN ${isbn}`);
        }
      });
  }
}
