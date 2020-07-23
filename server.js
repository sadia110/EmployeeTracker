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
    port:3006, 
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    insecureAuth : true
});   

console.log( db )


