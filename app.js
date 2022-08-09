const path = require('path') 
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')

// Load config
dotenv.config({ path: './.gitignore/config.env'})

// Passport config
require('./config/passport')(passport)

// Connect database
connectDB()

const app = express()

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override 
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))

// Use morgan if we're running in dev mode 

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars Helpers
const { 
    formatDate, 
    stripTags, 
    truncate, 
    stripBreakSpace, 
    editIcon, 
    select, 
    isUnassigned, 
    isInProgress, 
    isComplete, 
    dueDateAlert
 } = require('./helpers/hbs')

// Handlebars for web template to wrap around views
app.engine('.hbs', engine({ helpers: {
    formatDate, 
    stripTags, 
    truncate, 
    stripBreakSpace, 
    editIcon,
    select,
    isUnassigned,
    isInProgress,
    isComplete,
    dueDateAlert,
    }, 
    defaultLayout: 'main', 
    extname: '.hbs'}));

app.set('view engine', '.hbs');

// Express session middleware
app.use(session({
    secret: 'danny carey',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })

}))


// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})

// Static style folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/tickets', require('./routes/tickets'))
app.use('/engineering', require('./routes/tickets_engineering'))
app.use('/product', require('./routes/tickets_product'))
app.use('/marketing', require('./routes/tickets_marketing'))

const PORT = process.env.PORT || 3000



app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)