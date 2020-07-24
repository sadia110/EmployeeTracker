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

// DEPT
if( response.action=="department" ){
    let departmentList = await db.query( "SELECT * FROM department" )
    console.table( departmentList )

    response = await inquirer.prompt([
        {   
            message:"What do you want to do now?", 
            type:"list", 
            name:"action", 
        choices:[
            {   
                name: "Add a department", 
                value: "add" 
            },
            {   
                name: "Return to main menu", 
                value: "return" 
            }
        ]}
    ])

    // to add new dept
    if( response.action == "add" ){
        response = await inquirer.prompt([
            {   
                message: "Enter department name", 
                type:"input", 
                name:"createDep" 
            }
        ]) 

        // to save to DB
    
        let newDep = await db.query( "INSERT INTO department VALUES( ?,? ) ", 
        [ 0, response.createDep ] )
        
        console.log( `Department ${response.createDep} has been added to database.`)
        mainApp()
    }


    if( response.action=="return" ){
        console.log( `Returning to the main menu...`)
        mainApp()
    }
}
if( response.action=="role"){
    
    let roleList = await db.query( "SELECT * FROM role" )
    console.table( roleList )

    response = await inquirer.prompt([
        {   
            message:"What do you want to do now?",  
            type:"list", 
            name:"action", 
        choices:[
            {   
                 name: "Add a role", 
                 value: "add" 
            },
            {   
                name: "Remove a role", 
                value: "remove" 
            },
            {   
                name: "Return to main menu", 
                value: "return" 
            }
        ]}
    ])
// to add new role
if( response.action == "add" ){
    const dbDepartment = await db.query( "SELECT * FROM department")
    department = []
    dbDepartment.forEach( (item) => {
        department.push( { name: item.name, value: item.id } )
    })

    response = await inquirer.prompt([
        {   
            message: "Enter new roole", 
            type:"input", 
            name:"name" 
        },
        {   
            message: "Enter salary for new role", 
            type:"input",   
            name:"salary" 
        },
        {   
            message: "Enter dept fornew role",
            type:"list", 
            name:"department",
            choices: department},
    ]) 

    // to save to DB
    let newRole = await db.query( "INSERT INTO role VALUES( ?, ?, ?, ?)", 
    [ 0, response.name, response.salary, response.department ] )
    
    console.log( `Role ${response.name} has been added to database.`)
    mainApp()
}


if( response.action=="return" ){
    console.log( `Returning to the main menu...`)
    mainApp()
}
}





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
  
    if( response.action=="update"){
        let employeeNames = []
        employeeList.forEach( (item) =>{
            employeeNames.push( { name:item.employeeName, value:item.id } )
        })

        const dbRole = await db.query( "SELECT * FROM role")
        role = []
        dbRole.forEach( (item) => {
            role.push( { name: item.title, value: item.id } )
        })

        response = await inquirer.prompt([
            {   
                
            },
            {  
            },
        ])

       let newRole = await db.query( "INSERT INTO role VALUES( ?, ?, ?, ?)", 
    [ 0, response.name, response.salary, response.dept ] )
    
    console.log( `Role ${response.name} has been added to database.`)
    mainApp()



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