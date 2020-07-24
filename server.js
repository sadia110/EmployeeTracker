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


// async function mainApp(){ 

//     let employeeList = await db.query( "SELECT * FROM employee" ) 
//     console.log ( employeeList ) 
// } 

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
                } 
            ] 
        }
    ])

    console.log( response.action )    
    
    

    if( response.action=="department" ){
        //Display department list
        let departmentList = await db.query( "SELECT * FROM department" )
        console.table( departmentList )

        //Prompt user for further action for department info
        response = await inquirer.prompt([
            { message:"What do you want to do now?", type:"list", name:"action", 
            choices:[
                { name: "Add a department", value: "add" },
                { name: "Remove a department", value: "remove" },
                { name: "Return to main menu", value: "return" }
            ]}
        ])

        //Add new department to database
        if( response.action == "add" ){
            response = await inquirer.prompt([
                { message: "What is the name of new department?", type:"input", name:"createDep" }
            ])
        
            let newDep = await db.query( "INSERT INTO department VALUES( ?,? ) ", 
            [ 0, response.createDep ] )
            
            console.log( `Department ${response.createDep} has been added to database.`)
            mainApp()
        }



    // table join employee names 
 if( response.action=="employee" ){
    let employeeList = await db.query( 
        "SELECT CONCAT(e.first_name,' ',e.last_name) AS employeeName,"+
        "CONCAT(m.first_name,' ',m.last_name) AS managerName,r.title,r.salary "+
        "FROM employee AS e "+
        "LEFT JOIN employee AS m ON(e.manager_id=m.id) "+
        "LEFT JOIN role AS r ON(e.role_id=r.id)" )
    console.table( employeeList )  

        response = await inquirer.prompt([ 
            {   
                message: "What would you like to do next?",
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
                        name: "Return to the  menu", 
                        value: "return" 
                    } 
                ] 
            }
        ])   
    
         
        console.log( response.action )   

 

// ADD EMPLOYEES
        if( response.action=="add" ){
            const dbRole = await db.query( "SELECT * FROM role")
            role = []
            dbRole.forEach( function( item ){
                role.push( { name: item.title, value: item.id } )
            })
            console.log( `role: `, role ) 

            response = await inquirer.prompt([
                {  
                     message: "What is their first name?", 
                    type: "input", 
                    name: "first_name" 
                },
                {   
                    message: "What is their last name?",    
                    type: "input", 
                    name: "last_name" 
                },
                {   
                    message: "What is their role", 
                    type: "list", 
                    name: "role",
                    choices: role  
                },
                {   
                    message: "Who is their manager?",   
                    type: "list", 
                    name: "department",
                    choices: [ "no one"] 
                }                    
            ]) 

            console.log(  `user info: `, response )


            // to save into DB
            let saveResult = await db.query( "INSERT INTO employee VALUES( ?,?,?,?,? ) ", 
                                            [ 0, response.first_name, response.last_name, response.role, 1 ] )
            console.log( `.. user saved: new user-id=`, saveResult.insertId )  

        } 
        if( response.action=="return" ){
            mainApp()
        }
    } 

} 
} 
mainApp ()
