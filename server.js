const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const formidable = require('express-formidable');
const fsPromises = require('fs').promises;
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

// Middleware to parse JSON requests
app.use(bodyParser.json());

// MongoDB connection URI
const uri = 'mongodb+srv://tohong:To56117981@cluster0.bqkhr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const mongoose = require("mongoose");

// Import User Schema
const User = require('./models/users.js');
const Book = require('./models/books.js');

// Set EJS as the view engine
app.set('view engine', 'ejs');

// MongoDB configuration
const mongourl = uri;
const dbName = 'test';
const collectionNameUsers = "users";
const collectionNameBooks = "books"; // Collection for books
const client = new MongoClient(mongourl, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const users = new Array(
    {name: 'Alex', password: '123'},
    {name: 'Bobby', password: '123'}, 
    {name: 'Carmen', password: '123'},
    {name: 'Daisy', password: '123'},
    {name: 'Eason', password: '123'}    
    );

    app.get('/login', async (req, res) => {

        res.status(200).render('login');
    });
    
    app.post('/login', (req, res) => {

        const checkuser = users.find(user =>
            user.name === req.body.name && user.password === req.body.password
        );
        if (checkuser) {
            return res.redirect('/libraries');
        } else {
            return res.redirect('/libraries');
        }
    });


const insertDocument = async (db, doc) => {
    var collection = db.collection(collectionNameBooks);
    let results = await collection.insertOne(doc);
    console.log("insert one document:" + JSON.stringify(results));
    return results;
}


const insertUser = async (db, doc) => {
    const collection = db.collection(collectionNameUsers);
    let results = await collection.insertOne(doc);
    console.log("insert one user:" + JSON.stringify(results));
    return results;
};

// Function to find documents in the books collection
const findDocument = async (db, criteria) => {
    var collection = db.collection(collectionNameBooks);
    let results = await collection.find(criteria).toArray();
    console.log("find the documents:" + JSON.stringify(results));
    return results;
}
const findUser = async (db, criteria) => {
    var collection = db.collection(collectionNameUsers);
    let results = await collection.find(criteria).toArray();
    console.log("find the documents:" + JSON.stringify(results));
    return results;
}

// Function to update a document in the books collection
const updateDocument = async (db, criteria, updateData) => {
    var collection = db.collection(collectionNameBooks);
    let results = await collection.updateOne(criteria, { $set: updateData });
    console.log("update one document:" + JSON.stringify(results));
    return results;
}

// Function to delete documents from the books collection
const deleteDocument = async (db, criteria) => {
    var collection = db.collection(collectionNameBooks);
    let results = await collection.deleteMany(criteria);
    console.log("delete one document:" + JSON.stringify(results));
    return results;
}

// Function to find users in the users collection


// Passport configuration for session management
var user = {};
passport.serializeUser(function (user, done) { done(null, user); });
passport.deserializeUser(function (id, done) { done(null, user); });
app.use(session({
    secret: "tHiSiIsasEcRetStr", // Secret for session
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Facebook authentication strategy
passport.use(new FacebookStrategy({
    clientID:  '1208996296833638',
    clientSecret: 'dfd29a86a2372fd19e40f1f01dc47d28',
    callbackURL: 'https://three81project-group42.onrender.com/auth/facebook/callback'
},
    function (token, refreshToken, profile, done) {
        console.log("Facebook Profile: " + JSON.stringify(profile));
        user = {};
        user['id'] = profile.id;
        user['name'] = profile.displayName;
        user['type'] = profile.provider;
        console.log('user object: ' + JSON.stringify(user));
        return done(null, user);
    })
);

// Middleware for logging requests
app.use((req, res, next) => {
    let d = new Date();
    console.log(`TRACE: ${req.path} was requested at ${d.toLocaleDateString()}`);
    next();
});


// Facebook authentication routes
app.get("/auth/facebook", passport.authenticate("facebook", { scope: "email" }));
app.get("/auth/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect: "/libraries", // Redirect on success
        failureRedirect: "/" // Redirect on failure
    }));


const handle_Create = async (req, res) => {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    let newDoc = {
        bookName: req.fields.bookName,
        rating: req.fields.rating
    };

    await insertDocument(db, newDoc);
    res.redirect('/');
}

const handle_User_Create = async (req, res) => {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    let newDoc = {
        username: req.fields.username,
        password: req.fields.password
    };
    // Handle file upload if present

    await insertUser(db, newDoc);
    res.redirect('/login');
}

// Handle finding books
const handle_Find = async (req, res, criteria) => {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const docs = await findDocument(db, {});
    res.status(200).render('libraries', { books: docs, user: req.user });
}

// Handle finding users
const handle_Find_User = async (req, res, criteria) => {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const docs = await findUser(db, {});
    res.status(200).render('login', { users: docs, user: req.user });
}

// Handle book details
const handle_Details = async (req, res, criteria) => {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    let DOCID = { _id: ObjectId.createFromHexString(criteria._id) };
    const docs = await findDocument(db, DOCID);
    res.status(200).render('libraries', { books: docs[0], user: req.user });
}

// Handle editing a book
const handle_Edit = async (req, res, criteria) => {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    let DOCID = { '_id': ObjectId.createFromHexString(criteria._id) };
    let docs = await findDocument(db, DOCID);
    if (docs.length > 0) {
        res.status(200).render('edit', { books: docs[0], user: req.user });
    } else {
        res.status(500).render('libraries', { message: 'Unable to edit - you are not the book owner!', user: req.user });
    }
}

// Handle book updates
const handle_Update = async (req, res, criteria) => {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const DOCID = {
        '_id': ObjectId.createFromHexString(req.fields._id)
    }
    let updateData = {
        bookName: req.fields.bookName,
        rating: req.fields.rating,
    };
    // Handle file upload if present
    if (req.files.filetoupload && req.files.filetoupload.size > 0) {
        const data = await fsPromises.readFile(req.files.filetoupload.path);
        // You may want to process the uploaded file here
    }
    const results = await updateDocument(db, DOCID, updateData);
    res.redirect('/');
}

// Handle book deletion
const handle_Delete = async (req, res) => {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    let DOCID = { _id: ObjectId.createFromHexString(req.query._id) };
    let docs = await findDocument(db, DOCID);
    if (docs.length > 0) {
        await deleteDocument(db, DOCID);
    }
    res.redirect('/');
}

/* End of CRUD handler functions */

// Middleware for handling file uploads
app.use(formidable());

// Library Management Routes

// Route to display the form for adding a new book
app.get('/new', (req, res) => {
    res.render('new', { user: req.user });
});

// Main route
app.get('/', (req, res) => {
    handle_Find(req, res, req.query.docs);
    res.redirect('/libraries');
});

// Route to display libraries
app.get('/libraries',  async (req, res) => {
    await client.connect();
    const db = client.db(dbName);
    const docs = await findDocument(db, {});
    res.render('libraries', { books: docs, user: req.user });
});


// Route for creating a new book
app.get('/create',  (req, res) => {
    res.status(200).render('new', { user: req.user });
});

// Handle creation of a new book
app.post('/create',  (req, res) => {
    handle_Create(req, res);
});

app.post('/new',  (req, res) => {
    handle_Create(req, res, req.query);
});

app.post('/userCreate',  (req, res) => {
    handle_User_Create(req, res);
});

// Route for book details
app.get('/details' , (req, res) => {
    handle_Details(req, res, req.query);
});

// Route for editing a book
app.get('/edit',  (req, res) => {
    handle_Edit(req, res, req.query);
});

// Handle updating a book
app.post('/update', (req, res) => {
    handle_Update(req, res, req.query);
});

// Handle new book creation


// Route for deleting a book
app.get('/delete', (req, res) => {
    handle_Delete(req, res);
});

// Logout route
app.get("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// RESTful API for Read (GET): Fetch all books
app.get('/api/books', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const books = await findDocument(db, {});
        res.status(200).json({ success: true, data: books });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'An error occurred while fetching books' });
    }
});

// RESTful API for Create (POST): Add a new book
app.post('/api/books', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const newBook = {
            bookName: req.body.bookName,
            rating: req.body.rating,
        };

        const existingBook = await findDocument(db, { bookName: req.body.bookName });
        if (existingBook.length > 0) {
            return res.status(400).json({ success: false, message: 'Book with this name already exists' });
        }

        const result = await insertDocument(db, newBook);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'An error occurred while creating the book' });
    }
});

// RESTful API for Update (PUT): Update an existing book by bookName
app.put('/api/books/:bookName', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const bookName = req.params.bookName;

        const updateData = {
            ...(req.body.bookName && { bookName: req.body.bookName }),
            ...(req.body.rating && { rating: req.body.rating }),
        };

        const result = await updateDocument(db, { bookName }, updateData);

        if (result.matchedCount > 0) {
            res.status(200).json({ success: true, message: 'Book updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Book not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'An error occurred while updating the book' });
    }
});

// RESTful API for Delete (DELETE): Delete an existing book by bookName
app.delete('/api/books/:bookName', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const bookName = req.params.bookName;

        const result = await deleteDocument(db, { bookName });

        if (result.deletedCount > 0) {
            res.status(200).json({ success: true, message: 'Book deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Book not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'An error occurred while deleting the book' });
    }
});




// Route for user registration
app.get('/register', (req, res) => {
    res.status(404).render('register', { message: `${req.path} - Unknown request!` });
});

// Catch-all route for unknown requests
app.get('/*', (req, res) => {
    res.status(404).render('libraries', { message: `${req.path} - Unknown request!` });
});

// Start the server
const port = process.env.PORT || 8099;
app.listen(port, () => { console.log(`Listening at http://localhost:${port}`); });
