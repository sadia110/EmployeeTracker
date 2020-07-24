# NOTE: if sql not connecting with node run the following commands first 

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Batool12'; 
flush privileges; 

# Creating a database 
CREATE DATABASE employedata; 

#Switching to the database 
USE employedata; 

#Create Table. 
CREATE TABLE department (
	id INT AUTO_INCREMENT PRIMARY KEY, 
	name VARCHAR (30)
); 

CREATE TABLE role (
	id INT AUTO_INCREMENT PRIMARY KEY, 
	title VARCHAR(30), 
	salary DECIMAL

); 

CREATE TABLE employee (
	id INT AUTO_INCREMENT PRIMARY KEY, 
	first_name VARCHAR(30),
	last_name VARCHAR (30), 
	role_id INTEGER,
	manager_id INTEGER
); 


# Inserting data into table  
INSERT INTO department VALUE (1, "Web Dev" );
INSERT INTO department VALUE (1, "HR" ); 
INSERT INTO department VALUE (1, "Sales" ); 
INSERT INTO department VALUE (1, "Admin" );






INSERT INTO role VALUES(1,"Senior Developer", "50000.00");  
INSERT INTO role VALUES(1,"Junior Developer", "30000.00");   
INSERT INTO role VALUES(1,"FrontEnd Developer", "40000.00"); 
INSERT INTO role VALUES(1,"BackEnd Developer", "40000.00");    


INSERT INTO employee VALUES(1,"Employee1", "Lastname1", 1, 1 ); 
INSERT INTO employee VALUES(0,"Employee2", "Lastname2", 1, 1 ); 
INSERT INTO employee VALUES(0,"Employee3", "Lastname3", 1, 1 );  


SELECT * FROM employee 

