const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');



const app = express();

app.listen(5000 , ()=> {

    console.log("server is up and running !!!" )
} )


app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
    user: "root",
    host :'localhost',
    password : "hellosachin",
    database : "mockexam"

})

connection.connect((err)=>{
    if(err){
        console.log("error connecting to db" , err)
    }
    console.log("connected to database !!")
})

app.post('/api/register', (req, res) => {
    const { user_name, email, password } = req.body;
  
    const sql = 'INSERT INTO users (user_name, email, password) VALUES (?, ?, ?)';
    const values = [user_name, email, password];
  
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        res.status(500).json({ error: 'An error occurred while registering the user.' });
        return;
      }
      console.log('User inserted successfully:', result);
  
      // Send a success response back to the client
      res.status(200).json({ message: 'User registered successfully.' });
    });
  });


  // login functionality

  app.post('/api/user/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Retrieve the user record from the database
      const query = "SELECT * FROM users WHERE email = ?";
      connection.query(query, [email], (error, results) => {
        if (error) {
          console.error('Error during login:', error);
          return res.status(500).json({ message: 'An error occurred during login.' })
        }
  
        if (results.length === 0) {
          // User not found
          return res.status(401).json({ message: 'Invalid emaile or password.' });
        }
  
        const user = results[0];
  
        // Compare the provided password with the stored password
        if (password !== user.password) {
          // Passwords don't match
          return res.status(401).json({ message: 'Invalid username or password.' });
        }
  
        // Return a success message
        //res.json({ message: 'Login successful.' });
        res.send({user})
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'An error occurred during login.' });
    }
  });
  
 // to get user data

 app.get("/api/get/userdata/:userID" , (req , res)=>{
          
        const userID = req.params.userID ;

       try{
        connection.query("SELECT * FROM `users` WHERE user_id = ?" ,[userID], (err , result)=>{

            if(err){
                console.log("error in getting data", err);
                return res.status(500).json({message : "error in fetching user data"})
            }

            res.send({result});

        })


       }
       catch (err){
        console.log("error in fetching user data", err);
        res.status(500).json({message : "error in fetching user data"})

       }

 })







