const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

let app = express();

// Configurations
const PORT = process.env.PORT || 3000;
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});
hbs.registerHelper('printMaintenanceMessage', () => {
  return "The site is currently being updated :)";
})

// Middleware
app.use((req, res, next) => {
  // Generate a server log
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server log.');
    }
  });
  next();
});

// HALT SITE - MAINTENANCE
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });


// Set public directory (**MUST** come after maintenance middleware)
app.use(express.static(__dirname + '/public'));

// Route Handling
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home',
    homeWelcome: 'Welcome to my site!'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About',
    aboutWelcome: 'Thank you for visiting the about page.'
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects',
    projectWelcome: 'Thank you for visiting the projects page.'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    error: 'Error Handling Request'
  });
})

// Port Listening
app.listen(PORT, () => {
  console.log(`--Listening on Port ${PORT}--`);
});