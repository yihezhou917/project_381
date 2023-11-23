const express = require('express');
const app = express();
const assert = require('assert');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const ejs = require('ejs');


// Set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'your_secret_key',
  resave: true,
  saveUninitialized: true
}));

// connect to MongoDB
const uri = 'mongodb+srv://user_new:userpassword@cluster0.zx0fgzb.mongodb.net/your_database?retryWrites=true&w=majority';

let employeeCollection;

MongoClient.connect(uri, { useNewUrlParser: true })
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db('your_database');
    employeeCollection = db.collection('employees');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Set up view engine
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { message: 'Welcome! Please use the admin account to login' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate login credentials
  const users = [
    { name: 'admin1', password: '111' },
    { name: 'admin2', password: '222' }
  ];
  const user = users.find(u => u.name === username && u.password === password);

  if (user) {
    req.session.user = user;
    res.redirect('/homepage');
  } else {
    res.render('login', { message: 'Invalid username or password' });
  }
});

app.get('/homepage', (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    res.render('homepage');
  }
});

// API: Create an employee
app.get('/employees/create', (req, res) => {
  res.render('create');
});

app.post('/employees', (req, res) => {
  const { employeeId, name, department, position, salary, phoneNumber } = req.body;

  // Validate input

  const newEmployee = {
    employeeId,
    name,
    department,
    position,
    salary,
    phoneNumber
  };

  employeeCollection
    .insertOne(newEmployee)
    .then(() => {
      res.redirect('/homepage');
    })
    .catch(err => {
      console.error('Error creating employee:', err);
      res.status(500).send('Internal Server Error');
    });
});

// API: Search employees by employee ID
app.get('/employees/search', (req, res) => {
  res.render('search', { message: '' });
});

app.post('/employees/search', (req, res) => {
  const { employeeId } = req.body;

  employeeCollection
    .findOne({ employeeId })
    .then(employee => {
      if (!employee) {
        res.render('search', { message: 'Employee not found' });
      } else {
        res.redirect(`/employees/${employee.employeeId}`);
      }
    })
    .catch(err => {
      console.error('Error searching employee:', err);
      res.status(500).send('Internal Server Error');
    });
});

// API: Get employee details by employee ID
app.get('/employees/:id', (req, res) => {
  const employeeId = req.params.id;

  employeeCollection
    .findOne({ employeeId })
    .then(employee => {
      if (!employee) {
        res.status(404).send('Employee not found');
      } else {
        res.render('detail', { employee });
      }
    })
    .catch(err => {
      console.error('Error fetching employee:', err);
      res.status(500).send('Internal Server Error');
    });
});

// API: Update an employee
app.post('/employees/:id/update', (req, res) => {
  const employeeId = req.params.id;
  const { name, department, position, salary, phoneNumber } = req.body;

  employeeCollection
    .updateOne(
      { employeeId },
      { $set: { name, department, position, salary, phoneNumber } }
    )
    .then(() => {
      res.redirect(`/employees/${employeeId}`);
    })
    .catch(err => {
      console.error('Error updating employee:', err);
      res.status(500).send('Internal Server Error');
    });
});

// API: Delete an employee
app.post('/employees/:id/delete', (req, res) => {
  const employeeId = req.params.id;

  employeeCollection
    .deleteOne({ employeeId })
    .then(() => {
      res.redirect('/homepage');
    })
    .catch(err => {
      console.error('Error deleting employee:', err);
      res.status(500).send('Internal Server Error');
    });
});

// API: Show all employees
app.get('/employees/all', (req, res) => {
  employeeCollection
    .find()
    .toArray()
    .then(employees => {
      res.render('all', { employees });
    })
    .catch(err => {
      console.error('Error retrieving employees:', err);
      res.status(500).send('Internal Server Error');
    });
});

// Start the server
const port = 8099;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
