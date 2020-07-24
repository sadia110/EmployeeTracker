require('dotenv').config()


const mysql = require("mysql");
const inquirer = require("inquirer");

class Database {
  constructor( config ) {
      this.connection = mysql.createConnection( config );
  }
  query( sql, args ) {
      return new Promise( ( resolve, reject ) => {
          this.connection.query( sql, args, ( err, rows ) => {
              if ( err )
                  return reject( err );
              resolve( rows );
          } );
      } );
  }
  close() {
      return new Promise( ( resolve, reject ) => {
          this.connection.end( err => {
              if ( err )
                  return reject( err );
              resolve();
          } );
      } );
  }
}

  

const db = new Database ({
    host: "localhost", 
    port: 3306, 
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    insecureAuth : true 
}); 




let response
let role, department

async function mainApp(){
    response = await inquirer.prompt([
        {       
            message: "What do you want to do?",
            type: "list",      
            name: "action", 
            choices: [ 
                {   
                    name: "Manage Departments",     
                    value: "department"     
                },
                {   
                    name: "Manage Roles",   
                    value: "role"   
                }, 
                {   
                    name: "Manage Employees", 
                    value: "employee" 
                } ] }
    ])

async function mainApp(){ 

    let employeeList = await db.query( "SELECT * FROM employee" ) 
    console.log ( employeeList ) 
} 
   //  table to join employee name 
   if( response.action=="employee" ){
    let employeeList = await db.query( 
        "SELECT e.id," +
        "CONCAT(e.first_name,' ',e.last_name) AS employeeName,"+
        "CONCAT(m.first_name,' ',m.last_name) AS managerName,r.title,r.salary "+
        "FROM employee AS e "+
        "LEFT JOIN employee AS m ON(e.manager_id=m.id) "+
        "LEFT JOIN role AS r ON(e.role_id=r.id)" )

    console.table( employeeList ) 


    response = await inquirer.prompt([
        {       
            message: "What do you want to do now?", 
            type: "list", 
            name: "action", 
            choices: [
                {   
                    name: "Update Employee Role", 
                    value: "update" 
                }, 
                {   
                    name: "Add Employee", 
                    value: "add" 
                },
                {   
                    name: "Return to the main menu", 
                    value: "return" 
                } 
            ] 
        }
    ])        





// ADD EMPLOYEES
    if( response.action=="add" ){
        const dbRole = await db.query( "SELECT * FROM role")
        role = []
        dbRole.forEach( function( item ){
            role.push( { name: item.title, value: item.id } )
        })
                    
        response = await inquirer.prompt([
            {       
                message: "Enter employee  first name", 
                type: "input", 
                name: "first_name" 
            },
            {       
                message: "Enter employee last name", 
                type: "input", 
                name: "last_name" 
            },
            {   
                 message: "Enter employee role", 
                 type: "list", 
                 name: "role",
                choices: role 
            },
            {   
                 message: "Enter employee  manager", 
                 type: "list", 
                 name: "department",
                choices: [ "no one"] 
            }                    
        ]) 

        //INSERT INTO employee VALUES( 0, "Employee2", "Lastname2", 1, 1 );
        let saveResult = await db.query( "INSERT INTO employee VALUES( ?,?,?,?,? ) ", 
                                        [ 0, response.first_name, response.last_name, response.role, 1 ] )
        console.log( `Employee ${response.first_name + response.last_name} has been added to the database.` )
        mainApp()

    }


    if( response.action=="return" ){
        console.log( `Returning to the main menu...`)
        mainApp()
    }
}

}
mainApp()