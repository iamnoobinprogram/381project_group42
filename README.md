# 381project_group42
## Project Name
**Book Share Website**
## Group Information
- **Group No.:** 381project-42
- **Students’ Names and SIDs:**
  - Li Ka Chun (SID: 13698042)
  - Yip Chi Shing (SID: 13143800)
  - 13697997
  - 13728710

# Project file intro

  server.js: a brief summary of functionalities it provided,
  it contains the functional code of the entire system (such as login, logout, CRUD functions)
  package.json: lists of dependencies
  views: what EJS or UI files included
  models: what model files included
# Cloud URL

# Operation guides
  ## login function
  In the login page, user can chose using username and password to login or use facebook to login, 
  moreover, new user can create a new account.
  ## list function
  When user login success, they will locate to the main page,the main page will list all the book in
  the database.
  In the main page, user can create, edit and delete the book that they want through the buttons.
  ## Create function
  User click the "add new book" button an locate to the create page
  User can enter the book title and rating to create a new book.
  ## Edit function
  User click the "edit" button to edit the book and locate to the edit page
  User can enter the book title and rating to edit the book that they chose.
  ## Delete function
  User click the "delete" button to detele the book that they chose.

# RESTful CRUD
  ## GET
  **Path url:** `/api/books`
  Test:
  ```bash
  curl -X GET http://localhost:8099/api/books
  ```
  ## DELETE
  **Path url:** `/api/books/:bookName`
  Test:
  ```bash
  curl -X DELETE http://localhost:8099/api/books/bookName
  ```
# Project Information



## Project Overview
This Book Share Website is designed to let people share books and give them a rating.
