# Bookish - A Social Book Cataloguing Web App

Bookish is an online platform that provides users with a digitised bookshelf to view, update and organise their book collection across all reading formats including physical books, eBooks and audiobooks. Users will be able to view details about each book and interact with each book's cover, as well as create and manage new bookshelves filtered by categories.  

This web app was created as my project for SIT120 Introduction to Responsive Web Apps, but I plan on continue to work on this app beyond the end of the unit to continue developing new features and evolve Bookish into a fully functional CRUD application. The current todo list of features is shown below in no particular order than the largest scope items being at the bottom.

## Planned features

* ~~Convert from Vue 2 to Vue 3 (uni required the app to be in Vue 2 despite it reaching EOL at the end of 2023).~~ DONE!
* ~~Set placeholder image for books added without a cover.~~ DONE!
* ~~Update pathing of assets for build version.~~ DONE!
* ~~Add an edit page similar to the new book form that allows a user to edit the book details.~~ DONE!
* ~~Add ability to delete a book from the user's bookshelf.~~ DONE!
* Add ability to remove genres and categories from the list in the form (both for adding and updating).
* Allow users to delete categories from side panel.
* Add a database to replace books.json using Firebase.
* Add icon to footer that links to GitHub repo.
* Create new favicon.
* Add hover text on book covers in Homepage view to display book's title, this will allow the user to distinguish between multiple books with a placeholder cover.
* Add search bar to app-header that finds the closest match for book and opens details view.
* Pre-load back cover when component is mounted rather than when arrow is clicked.
* Pre-load homepage assets prior to rendering when app is accessed for the first time.
* Change "Add new book" button to a plus symbol and make the text appear when hovered over.
* Show 3 bookshelves by default regardless of number of books in All Books.
* Apply some more animations and transitions to make the app look modern and nice.
* Add some shadows/3D effects to the book covers on the homepage view to create the illusion of books on shelves rather than just 2D images.
* Add "Are you sure?" prompt when book is deleted.
* Prompt a user to confirm if new category should be created if what they input doesn't match a category on the side panel.
* Add error handling and edge case handling.
* Add sorting functionality.
* Add input validation for cover upload.
* Make categories clickable in book-details which has the same filtering functionality as the side-panel (go back sends user back to book details page).
* Add spine attribute to each book in database and modify new book form to allow upload.
* Add book cover animation functionality to the homepage view (arrows on shelf divider).
* Change the "Go back" button so it returns to previous view at the same scroll point. (remember how far the user scrolled down the page)
* Add more details to book object via new book form fields (e.g. page count, edition)
* Expand book details page functionality (edit star rating in page, page count, user reviews, alternate covers/editions etc.)
* Add cookies to remember user settings.
* Add user account functionality and authentication.
* Add social media elements such as being able to view other user's bookshelves and interact with them in some form.
* Add filter by star rating.

## Bugs to Fix

* ~~Fix responsive styling of Edit button.~~ DONE!
* Fix minor styling issue with book form on smaller desktops.
* Fix width of bookshelf and divider textures, slightly too short when the side panel is collapsed.
* Fix input validation in the form (appears the HTML element's built-in validation doesn't work as it is not a HTML form).
* Fix book cover preview in edit form.
* Fix styling of summary in book details for books added via form.
* Fix book cover styling to prevent sides from being cut off on certain screen widths.
* Fix some of the responsive side panel's functionality.
* Clean up console log errors and warnings.
