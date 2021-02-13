const mysql = require('mysql');
const inquirer = require('inquirer');
const Database = require('./async-db');

const db = new Database({
      host: 'localhost',

      // Your port; if not 3306
      port: 3306,

      // Your username
      user: 'root',

      // Be sure to update with your own MySQL password!
      password: 'Chuff64)hans',
      database: 'employee_db',
})

const getManagerNames = async () => {
      let query = "SELECT * FROM employee WHERE manager_id IS NULL";

      const rows = await db.query(query);
      //console.log("number of rows returned " + rows.length);
      let employeeNames = [];
      for (const employee of rows) {
            employeeNames.push(employee.first_name + " " + employee.last_name);
      }
      return employeeNames;
}

const getRoles = async () => {
      let query = "SELECT title FROM role";
      const rows = await db.query(query);
      //console.log("Number of rows returned: " + rows.length);

      let roles = [];
      for (const row of rows) {
            roles.push(row.title);
      }

      return roles;
}

const getDepartmentNames = async () => {
      let query = "SELECT name FROM department";
      const rows = await db.query(query);
      //console.log("Number of rows returned: " + rows.length);

      let departments = [];
      for (const row of rows) {
            departments.push(row.name);
      }

      return departments;
}

// Given the name of the department, what is its id?
const getDepartmentId = async (name) => {
      let query = "SELECT id FROM department WHERE name=?";
      let args = [name];
      const rows = await db.query(query, args);
      return rows[0].id;
}

// Given the name of the role, what is its id?
const getRoleId = async (roleName) => {
      let query = "SELECT * FROM role WHERE role.title=?";
      let args = [roleName];
      const rows = await db.query(query, args);
      return rows[0].id;
}

// need to find the employee.id of the named manager
const getEmployeeId = async (fullName) => {
      // First split the name into first name and last name
      let employee = getFirstAndLastName(fullName);

      let query = 'SELECT id FROM employee WHERE employee.first_name=? AND employee.last_name=?';
      let args = [employee[0], employee[1]];
      const rows = await db.query(query, args);
      return rows[0].id;
}

const getEmployeeNames = async () => {
      let query = "SELECT * FROM employee";

      const rows = await db.query(query);
      let employeeNames = [];
      for (const employee of rows) {
            employeeNames.push(employee.first_name + " " + employee.last_name);
      }
      return employeeNames;
}

const viewAllRoles = async () => {
      console.log("");
      // SELECT * FROM role;
      let query = "SELECT role.id as 'ID', role.title as 'Position', role.salary as 'Salary', department.name as 'Department' FROM role JOIN department ON role.department_id = department.id";
      const rows = await db.query(query);
      console.table(rows);
      return rows;
}

const viewAllDepartments = async () => {
      // SELECT * from department;

      let query = "SELECT id as 'ID', name as 'Department' FROM department";
      const rows = await db.query(query);
      console.table(rows);
}

const viewAllEmployees = async () => {
      console.log("");

      // SELECT * FROM employee;
      let query = "SELECT employee.id as 'ID', employee.first_name as 'First Name', employee.last_name as 'Last Name', role.title as 'Position', department.name as 'Department', role.salary as 'Salary', CONCAT(m.first_name, ' ', m.last_name) as 'Manager' FROM employee LEFT JOIN employee m ON m.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id;";
      const rows = await db.query(query);
      console.table(rows);
}

const viewAllEmployeesByDepartment = async () => {
      // View all employees by department
      // SELECT first_name, last_name, department.name FROM ((employee INNER JOIN role ON role_id = role.id) INNER JOIN department ON department_id = department.id);
      console.log("");
      let query = "SELECT employee.first_name as 'First Name', employee.last_name as 'Last Name', department.name as 'Department' FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY department.id;";
      const rows = await db.query(query);
      console.table(rows);
}

// Will return an array with only two elements in it: 
// [first_name, last_name]
const getFirstAndLastName = (fullName) => {
      // If a person has a space in their first name, such as "Mary Kay", 
      // then first_name needs to ignore that first space. 
      // Surnames generally do not have spaces in them so count the number
      // of elements in the array after the split and merge all before the last
      // element.
      let employee = fullName.split(" ");
      if (employee.length == 2) {
            return employee;
      }

      const last_name = employee[employee.length - 1];
      let first_name = " ";
      for (let i = 0; i < employee.length - 1; i++) {
            first_name = first_name + employee[i] + " ";
      }
      return [first_name.trim(), last_name];
}

const updateEmployeeRole = async (employeeInfo) => {
      // Given the name of the role, what is the role id?
      // Given the full name of the employee, what is their first_name and last_name?
      // UPDATE employee SET role_id=1 WHERE employee.first_name='Mary Kay' AND employee.last_name='Ash';
      const roleId = await getRoleId(employeeInfo.role);
      const employee = getFirstAndLastName(employeeInfo.employeeName);

      let query = 'UPDATE employee SET role_id=? WHERE employee.first_name=? AND employee.last_name=?';
      let args = [roleId, employee[0], employee[1]];
      const rows = await db.query(query, args);
      console.log(`Updated employee ${employee[0]} ${employee[1]} with role ${employeeInfo.role}`);
}

const viewAllEmployeesByDepartment2 = async () => {
      const departmentChoice = await getEmployeesByDept();
      const deptID = await getDepartmentId(departmentChoice.departmentName)
      let query = "SELECT first_name as 'First Name', last_name as 'Last Name', department.name as 'Department' FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.id = ?;";
      let args = [deptID];
      const rows = await db.query(query, args);
      console.table(rows);

}

const updateEmployeeManager = async (employeeInfo) => {
      //Given the name of the manager, what is the manager id? 
      //Given the full name of the employee, what is their first and last name? 
      //UPDATE employee SET manager_id = 1 WHERE employee.first_name = ? AND employee.last_name = ?;
      const managerID = await getEmployeeId(employeeInfo.manager)
      const employee = getFirstAndLastName(employeeInfo.employeeName)

      let query = 'UPDATE employee SET manager_id = ? WHERE employee.first_name = ? AND employee.last_name = ?';
      let args = [managerID, employee[0], employee[1]];
      const rows = await db.query(query, args);
      console.log(`Updated employee ${employee[0]} ${employee[1]} with manager ${employeeInfo.manager}`)
}

const addEmployee = async (employeeInfo) => {
      let roleId = await getRoleId(employeeInfo.role);
      let managerId = await getEmployeeId(employeeInfo.manager);

      // INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Bob", "Hope", 8, 5);
      let query = "INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
      let args = [employeeInfo.first_name, employeeInfo.last_name, roleId, managerId];
      const rows = await db.query(query, args);
      console.log(`Added employee ${employeeInfo.first_name} ${employeeInfo.last_name}.`);
}

const removeEmployee = async (employeeInfo) => {
      const employeeName = getFirstAndLastName(employeeInfo.employeeName);
      // DELETE from employee WHERE first_name="Cyrus" AND last_name="Smith";
      let query = "DELETE from employee WHERE first_name=? AND last_name=?";
      let args = [employeeName[0], employeeName[1]];
      const rows = await db.query(query, args);
      console.log(`Employee removed: ${employeeName[0]} ${employeeName[1]}`);
}

const addDepartment = async (departmentInfo) => {
      const departmentName = departmentInfo.departmentName;
      let query = 'INSERT into department (name) VALUES (?)';
      let args = [departmentName];
      const rows = await db.query(query, args);
      console.log(`Added department named ${departmentName}`);
}

const addRole = async (roleInfo) => {
      // INSERT into role (title, salary, department_id) VALUES ("Sales Manager", 100000, 1);
      const departmentId = await getDepartmentId(roleInfo.departmentName);
      const salary = roleInfo.salary;
      const title = roleInfo.roleName;
      let query = 'INSERT into role (title, salary, department_id) VALUES (?,?,?)';
      let args = [title, salary, departmentId];
      const rows = await db.query(query, args);
      console.log(`Added role ${title}`);
}

/* 
End of calls to the database
*/

const mainPrompt = () => {
      return inquirer
            .prompt([
                  {
                        type: "list",
                        message: "What would you like to do?",
                        name: "action",
                        choices: [
                              "Add department",
                              "Add employee",
                              "Add role",
                              "Remove employee",
                              "Update employee role",
                              "Update employee manager",
                              "View all departments",
                              "View all employees",
                              "View all employees grouped by department",
                              "View all employees by department",
                              "View all roles",
                              "Exit"
                        ]
                  }
            ])
}

const getAddEmployeeInfo = async () => {
      const managers = await getManagerNames();
      const roles = await getRoles();
      return inquirer
            .prompt([
                  {
                        type: "input",
                        name: "first_name",
                        message: "What is the employee's first name?"
                  },
                  {
                        type: "input",
                        name: "last_name",
                        message: "What is the employee's last name?"
                  },
                  {
                        type: "list",
                        message: "What is the employee's role?",
                        name: "role",
                        choices: [
                              // populate from db
                              ...roles
                        ]
                  },
                  {
                        type: "list",
                        message: "Who is the employee's manager?",
                        name: "manager",
                        choices: [
                              // populate from db
                              ...managers
                        ]
                  }
            ])
}

const getRemoveEmployeeInfo = async () => {
      const employees = await getEmployeeNames();
      return inquirer
            .prompt([
                  {
                        type: "list",
                        message: "Which employee do you want to remove?",
                        name: "employeeName",
                        choices: [
                              // populate from db
                              ...employees
                        ]
                  }
            ])
}

const getDepartmentInfo = async () => {
      return inquirer
            .prompt([
                  {
                        type: "input",
                        message: "What is the name of the new department?",
                        name: "departmentName"
                  }
            ])
}

const getRoleInfo = async () => {
      const departments = await getDepartmentNames();
      return inquirer
            .prompt([
                  {
                        type: "input",
                        message: "What is the title of the new role?",
                        name: "roleName"
                  },
                  {
                        type: "input",
                        message: "What is the salary of the new role?",
                        name: "salary"
                  },
                  {
                        type: "list",
                        message: "Which department uses this role?",
                        name: "departmentName",
                        choices: [
                              // populate from db
                              ...departments
                        ]
                  }
            ])
}

const getUpdateEmployeeRoleInfo = async () => {
      const employees = await getEmployeeNames();
      const roles = await getRoles();
      return inquirer
            .prompt([
                  {
                        type: "list",
                        message: "Which employee do you want to update?",
                        name: "employeeName",
                        choices: [
                              // populate from db
                              ...employees
                        ]
                  },
                  {
                        type: "list",
                        message: "What is the employee's new role?",
                        name: "role",
                        choices: [
                              // populate from db
                              ...roles
                        ]
                  }
            ])

}

const getEmployeesByDept = async () => {
      const department = await getDepartmentNames()
      return inquirer
            .prompt([
                  {
                        type: "list",
                        message: "Which department would you like to see all employees for?",
                        name: "departmentName",
                        choices: [
                              //populate from db
                              ...department
                        ]
                  }
            ])
}

const getUpdateEmployeeManagerInfo = async () => {
      const employees = await getEmployeeNames();
      const managers = await getManagerNames();
      return inquirer
            .prompt([
                  {
                        type: "list",
                        message: "Which employee do you want to update?",
                        name: "employeeName",
                        choices: [
                              // populate from db
                              ...employees
                        ]
                  },
                  {
                        type: "list",
                        message: "Who is the employees new manager?",
                        name: "manager",
                        choices: [
                              // populate from db
                              ...managers
                        ]
                  }
            ])
}

const main = async () => {
      let exitLoop = false;
      while (!exitLoop) {
            const prompt = await mainPrompt();

            switch (prompt.action) {
                  case 'Add department': {
                        const newDepartmentName = await getDepartmentInfo();
                        await addDepartment(newDepartmentName);
                        break;
                  }

                  case 'Add employee': {
                        const newEmployee = await getAddEmployeeInfo();
                        console.log("add an employee");
                        console.log(newEmployee);
                        await addEmployee(newEmployee);
                        break;
                  }

                  case 'Add role': {
                        const newRole = await getRoleInfo();
                        console.log("add a role");
                        await addRole(newRole);
                        break;
                  }

                  case 'Remove employee': {
                        const employee = await getRemoveEmployeeInfo();
                        await removeEmployee(employee);
                        break;
                  }

                  case 'Update employee role': {
                        const employee = await getUpdateEmployeeRoleInfo();
                        await updateEmployeeRole(employee);
                        break;
                  }

                  case 'Update employee manager': {
                        const employee = await getUpdateEmployeeManagerInfo();
                        await updateEmployeeManager(employee);
                        break;
                  }

                  case 'View all departments': {
                        await viewAllDepartments();
                        break;
                  }

                  case 'View all employees': {
                        await viewAllEmployees();
                        break;
                  }

                  case 'View all employees grouped by department': {
                        await viewAllEmployeesByDepartment();
                        break;
                  }

                  case 'View all employees by department': {
                        await viewAllEmployeesByDepartment2();
                        break
                  }

                  case 'View all roles': {
                        await viewAllRoles();
                        break;
                  }

                  case 'Exit': {
                        exitLoop = true;
                        process.exit(0); // successful exit
                        return;
                  }

                  default:
                        console.log(`Internal warning. Shouldn't get here. action was ${prompt.action}`);
            }
      }
}

// Close your database connection when Node exits
process.on("exit", async function (code) {
      await db.close();
      return console.log(`About to exit with code ${code}`);
});

main();