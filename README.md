# EMS-Employee-Management-System
CLI solution for managing a company's employees 

## Description
---
EMS is a CLI solution that allows employers to add employees, roles, and departments as their business grows and they need more employees.  You can lookup all your employees and their information, you can also look up all the employees by department.  If you need to remove an employee because they left, you can remove employees from your database with this tool.  Below is a list of function it can perform along with a list of future fucntionality.

### Current Fucntionality 
---
- Add Department:  Creates a new deparment
- Add Employee:  Adds an employee to the database. 
- Remove Employee:  Removes an employee from the database. 
- Update Employee Role:  Changes the role associated to an employee in the database. 
- Update Employee Manager:  If an employee changes role, they often need to change their manager. 
- View All Departments:  Allows you to view all the departments in your company. 
- View All Employees:  Allows you to view all the employees within your company. 
- View All Employees Grouped by Department:  Groups all employees by department for easy reading. 
- View All Employees By Department:  Allows you to select a department for which you want to see all employees for. 
- View All Roles:  Observe all positions within your company. 

### Future Fucntionality
- Remove Deparment
- Remove Role
- When adding an employee, making them a manager without having a manger themselves. 

## Requirements to Run 
- Node
- My SQL Server
- My SQL Workbench

Clone Git repo first.  Copy  the sql statements in schema.sql and seeds.sql and paste them into MySQLWorkbench, and run them block by block.  This will initialize your database.  Then, update the password at the top of index.js in the db object to the password you set when you installed mysql to your computer.  Once done, navigate in terminal to your folder that contains the index.js file, and run the following commands in terminal: 

      npm install

Then, 

      node index.js

Then you can use arrow keys to navigate and use the application.  

## Demo
---
Here is a GIF demoing the application: 
!["Gif showing the application"]('./assets/EMS_DEMO_1080p.gif')

Here is a more detailed youtube video showing the application: [Video](https://youtu.be/ZvdUdVixlFk)
