# Barcode Scan BookShelf
This Angular Material web application utlizes the ngx barcode scanner plugin to allow users to scan a book's ISBN code and search for that book in Google Books. The application is deployed to Firebase
and is available from [barcode-scan-bookshelf.web.app](https://barcode-scan-bookshelf.firebaseapp.com). Users can log into the application using their Google account to gain access to their Favorites Bookshelf.
An Ionic React PWA version also exists [here](https://github.com/s-sandra/bs-bookshelf).

## Finding Books
In addition to scanning and searching books by ISBN, a search by title feature is provided to conduct 
a manual search. This is useful in the event that the ISBN is not registered within Google Books, 
or the barcode scanner does not work. BS Bookshelf returns up to six matching book results, including
the book's cover image, rating, author, publisher, date, Google book link (accessed by clicking on the book's title) and Google Playstore link, if available.

## Saving Books
If users log in through their Google account and give BS BookShelf permission to access their Google library, they can save books that they find through the application to their Favorites bookshelf. Signed-in users can automatically save scanned books to their library from the bookshelf page, or by clicking on the add icon within a search result.
