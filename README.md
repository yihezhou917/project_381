Employee information management system
Group 44: ZHOU Yihe(13036267)
Application link: 

* Login
In the starting login page, administrators can use the following 2 admin accounts to login and use the employee information management system: 
[   { name: 'admin1', password: '111' },
    { name: 'admin2', password: '222' }
]
After successful login, account information will be stored in session.


* Logout
 Admin can logout by clicking "logout" on homepage.


* CRUD

1. Create
By clicking "add employee", homepage will direct to create employee page(create.ejs)
An employee record will contain following 6 attributes:
- Employee ID (E.g. 123)
- Name (E.g. sally)
- Department (E.g. IT)
- Position (E.g. project manager)
- Salary (E.g. 50000)
- Phone Number (E.g. 12121212)


2. Read
- By clicking "Search Employee", homepage will direct to search employee page(search.ejs), where admin can use employee ID to search for anemployee.
- By clickling "Show All Employee", homepage will direct to show all employee page where all employee records in the database will be shown.

Above 2 operations will direct the admin to detail page(detail.ejs)


3. Update
By clicking "update" on the detail page, admin can input updated information in the input field and update the employee information by clicking "update".


4. Delete
By clicking "delete" on the detail page, admin can delete the particular employee record.


* RESTful

- Post (for update employee record)
/employees/:id/update

- Get (for search employee record)
 /employees/:id

- Delete (for delete employee record)
/employees/:id/delete

For all restful CRUD services, login should be done at first.
