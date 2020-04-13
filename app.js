if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

const indexRouter = require('./routes/index.routes');
const authorsRouter = require('./routes/authors.routes');
const booksRouter = require('./routes/books.routes');

const app = express();

// DB connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('connected to database.'));

// setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view options', { layout: 'layouts/layout.ejs' });
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.urlencoded({ limit: '10mb', extended: false }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

// routes
app.use('/', indexRouter);
app.use('/authors', authorsRouter);
app.use('/books', booksRouter);


app.listen(process.env.PORT || 3000, () => {
    console.log('server is running.')
})
