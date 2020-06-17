import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  URI = 'https://www.googleapis.com/books/v1/';
  key = `&key=${environment.booksApiConfig.browserKey}`;
  pagination = `&startIndex=0&maxResults=6`;  // only want 6 book results

  constructor(private http: HttpClient) {}

  /**
   * Queries Google Books for six books of a given title.
   * @param bookTitle the name of the book to search.
   * @returns an Observable of AppBook[].
   */
  searchTitle(bookTitle: string) {
    bookTitle = bookTitle.replace(/\s/g, '%20');
    return this.http.get<Books>(`${this.URI}volumes?q=search+intitle:${bookTitle}${this.pagination}`)
      .pipe(
        map((response: Books) => this.parseBooks(response))
      );
  }

  /**
   * Queries Google Books for book with the given ISBN code.
   * @param isbn the ISBN code of the book.
   * @returns an Observable of AppBook[]
   */
  searchISBN(isbn: string) {
    return this.http.get<Books>(`${this.URI}volumes?q=search+isbn:${isbn}${this.pagination}`)
      .pipe(
        map((response: Books) => this.parseBooks(response))
      );
  }

  /**
   * Queries Google Books for entire contents of logged-in user's Favorites
   * Bookshelf.
   * @returns an Observable of AppBook[]
   */
  getBookshelf() {
    // Bookshelf with id 0 is the favorites bookshelf
    return this.http.get<Books>(`${this.URI}mylibrary/bookshelves/0/volumes?${this.key}`)
      .pipe(
        map((response: Books) => this.parseBooks(response)),
      );
  }

  /**
   * Deletes the book with the given id from the logged-in user's
   * Google Books Favorites Bookshelf.
   * @param bookId the id of the book to delete.
   */
  delete(bookId: string) {
    return this.http.post(`${this.URI}mylibrary/bookshelves/0/removeVolume?volumeId=${bookId}${this.key}`, null);
  }

  /**
   * Adds the book with the given id from the logged-in user's
   * Google Books Favorites Bookshelf.
   * @param bookId the id of the book to add.
   */
  add(bookId: string) {
    return this.http.post(`${this.URI}mylibrary/bookshelves/0/addVolume?volumeId=${bookId}${this.key}`, null);
  }

  /**
   * Parses Google Books query response and creates
   * AppBooks[] with relevant book information.
   * @param books the books to parse.
   * @returns an array of AppBook.
   */
  private parseBooks(books: Books): AppBook[] {
    const results: AppBook[] = [];

    // Google Books response is empty
    if (books.totalItems === 0) {
        return [];
    }

    books.items.forEach((book: BookInfo) => {
      const volume = book.volumeInfo;
      let cover: string;
      let published: string;

      // book has a cover image
      if (volume.imageLinks) {
          cover = volume.imageLinks.thumbnail;

          // choose highest quality cover available.
          if (volume.imageLinks.hasOwnProperty('extraLarge')) {
            cover = volume.imageLinks.extraLarge;
          }
          else if (volume.imageLinks.hasOwnProperty('large')) {
            cover = volume.imageLinks.large;
          }
          else if (volume.imageLinks.hasOwnProperty('medium')) {
            cover = volume.imageLinks.medium;
          }
          else if (volume.imageLinks.hasOwnProperty('small')) {
            cover = volume.imageLinks.small;
          }
      }

      if (volume.hasOwnProperty('publishedDate')) {
          published = volume.publishedDate;
      }

      const result = {
          id: book.id,
          title: volume.title,
          rating: (volume.hasOwnProperty('averageRating') ? volume.averageRating : undefined),
          bookLink: volume.previewLink,
          buyLink: (book.saleInfo.hasOwnProperty('buyLink') ? book.saleInfo.buyLink : undefined),
          authors: (volume.hasOwnProperty('authors') ? volume.authors.join(', ') : undefined),
          publisher: (volume.hasOwnProperty('publisher') ? volume.publisher : 'No Publisher'),
          date: (published ? published : undefined),
          image: (cover ? cover : undefined)
      };
      results.push(result);
    });
    return results;
  }
}

// Google Books volumeInfo for single volume
export interface GoogleBook {
  title: string;
  id: string;
  imageLinks?: {
    thumbnail: string;
    small?: string,
    medium?: string,
    large?: string,
    extraLarge?: string;
  };
  authors?: string[];
  averageRating?: number;
  publisher?: string;
  publishedDate?: string;
  previewLink: string;  // Google Books link
  buyLink?: string;  // Google Play link
}

// Parsed Google Books response
export interface AppBook {
  id: string;
  title: string;
  rating?: number;
  bookLink: string;  // Google  Books link
  buyLink?: string;  // Google Play link
  authors?: string;
  publisher: string;
  date?: string;
  image?: string;
}

// Google Books response for single volume
export interface BookInfo {
  volumeInfo: GoogleBook;
  id: string;
  saleInfo: {
    buyLink?: string
  };
}

// Google Books query response
export interface Books {
  items: BookInfo[];
  totalItems: number;
}
