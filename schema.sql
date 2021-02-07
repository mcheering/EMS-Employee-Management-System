create database employee_db;

use employee_db;

create table employee (
      employee_id int not null auto_increment,
      first_name varchar(30) not null,
      last_name varchar(30) not null, 
      role_id int not null, 
      manager_id int,
      primary  key (employee_id)
);

create table department (
      department_id int not null auto_increment, 
      name varchar(30) not null,
      primary key (department_id)
);

create table role (
      role_id int not null auto_increment,
      title varchar(30) not null,
      salary decimal(6, 0),
      department_id int not null,
      primary key (role_id)
);

insert into department (name) values ('Sales');
insert into department (name) values ('Engineering');
insert into department (name) values ('Finance');
insert into department (name) values ('Legal');

insert into role (title, salary, department_id) values ('Sales Lead', 100000, 1);
insert into role (title, salary, department_id) values ('Salesperson', 80000, 1);
insert into role (title, salary, department_id) values ('Lead Engineer', 150000, 2);
insert into role (title, salary, department_id) values ('Software Engineer', 120000, 2);
insert into role (title, salary, department_id) values ('Accountant', 125000, 3);
insert into role (title, salary, department_id) values ('Legal Team Lead', 250000, 4);
insert into role (title, salary, department_id) values ('Lawyer', 120000, 4);

insert into employee (first_name, last_name, role_id, manager_id) values ('John', 'Doe', 1, 3);
insert into employee (first_name, last_name, role_id, manager_id) values ('Mike', 'Chan', 2, 1);
insert into employee (first_name, last_name, role_id) values ('Ashley', 'Rodriguez', 3);
insert into employee (first_name, last_name, role_id, manager_id) values ('Kevin', 'Tupik', 4, 3);
insert into employee (first_name, last_name, role_id) values ('Malia', 'Brown', 5);
insert into employee (first_name, last_name, role_id) values ('Sarah', 'Lourd', 6);
insert into employee (first_name, last_name, role_id, manager_id) values ('Tom', 'Allen', 7, 6);
insert into employee (first_name, last_name, role_id, manager_id) values ('Tanner', 'Galal', 4, 5);

select * from emplyee;