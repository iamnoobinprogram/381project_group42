# 381project_group42
## Project Name
**Book-sharing website**
## Group Information
- **Group No.:** 381project-42
- **Students’ Names and SIDs:**
  - Li Ka Chun (SID: 13698042)
  - Yip Chi Shing (SID: 13143800)
  - Wong Chi Pan (SID: 13697997)
  - To Hong (SID: 13728710)
  

## Project Overview
This Book-sharing website is designed to let people share and rate books. It includes user authentication as well as creating, editing, and deleting books. It also provides users with a clean user interface to manage book lists.

# Project file intro

  server.js: a brief summary of functionalities it provided,
  it contains the functional code of the entire system (such as login, logout, CRUD functions)
  package.json: lists of dependencies
  views: EJS files included, 
  - libraries.ejs (to show book info here)
  - edit.ejs (to edit book info here)
  - login.ejs (to login)
  - LoginAC.ejs (islogin)
  - new.ejs (to create book)
  - register.ejs (to register)
  models: model files included,
  - users.js 
  1. **user name**
  2. **password**
  - books.js
  1. **user name**
  2. **libraries** (a list include bookName and rating)
# Cloud URL

https://three81project-group42.onrender.com/

# Operation guides
  ## Login function
  In the login page, user can chose using username and password to login or use facebook to login, 
  moreover, new user can create a new account.
  ## Logout function
  Users can log out of their accounts by clicking the logout button on the home page.
  ## List function
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
  User click the "delete" button to detele the book that they choose.

# SET UP
  ```bash
  npm install
  npm start
  ```
# RESTful CRUD
  ## GET
  **Path url:** `/api/books`
  
  Test:
  ```bash
  curl -X GET http://three81project-group42.onrender.com/api/books
  ```
  ## DELETE
  **Path url:** `/api/books/:bookName`
  Test:
  ```bash
  curl -X DELETE http://three81project-group42.onrender/api/books/bookName
  ```
  ## ADD
  Test:
  ```bash
  curl -X POST http://localhost:8099/api/books/
  -H "Content-Type: application/json" \
  -d '{"bookName": "helloworld",
  "rating": "8"}'
  ```
