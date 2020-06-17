import { Component, Input } from '@angular/core';
import { AppBook, BooksService } from '../books.service';
import { FirebaseService } from '../firebase.service';
import { PopupService } from '../popup.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent {
  @Input() books: AppBook[];
  @Input() context: 'search' | 'bookshelf';  // where the function was called

  constructor(
    public firebase: FirebaseService,
    public googleBooks: BooksService,
    private popup: PopupService) { }

  /**
   * Adds a new book to the user's bookshelf.
   * @param book the AppBook to add.
   * @param index optionally, the array index for the new book.
   * Useful when you are undoing a book delete.
   */
  saveBook(book: AppBook, index?: number): void {
    // if access tokens not expired
    if (!this.firebase.isExpired()) {
      this.googleBooks.add(book.id).subscribe(() => {
        // if this function is called within the bookshelf page
        if (this.context === 'bookshelf') {
          // modify the stored books
          if (index) {
            this.books.splice(index, 0, book);
          }
          else {
            this.books.unshift(book);
          }
        }
        const popup = this.popup.show('Book added to bookshelf.', 'Undo');
        popup.onAction()
          .subscribe(() =>
            this.deleteBook(book)
          );
      },
      () => {
        const error = this.popup.show('An error occurred! Unable to add book.', 'Try Again');
        error.onAction()
          .subscribe(() =>
            this.saveBook(book, index)
        );
      });
    }
    else {
      this.firebase.signIn();
    }
  }

  /**
   * Deletes a given AppBook from the user's bookshelf.
   * @param deleted the AppBook to delete.
   */
  deleteBook(deleted: AppBook): void {
    // if access tokens not expired
    if (!this.firebase.isExpired()) {
      this.googleBooks.delete(deleted.id)
      .subscribe(() => {
        let deletedIndex: number;

        // only update books array if delete occurs from bookshelf page
        if (this.context === 'bookshelf') {
          deletedIndex = this.books.findIndex(book => book.id === deleted.id);
          this.books.splice(deletedIndex, 1);
        }

        const popup = this.popup.show('Book removed from bookshelf.', 'Undo');
        popup.onAction()
          .subscribe(() => {
            this.saveBook(deleted, deletedIndex);
        },
        () => {
          const error = this.popup.show('An error occurred! Unable to delete book.', 'Try Again');
          error.onAction()
            .subscribe(() =>
              this.deleteBook(deleted)
          );
        });
      });
    }
  }
}
