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
      // Retrieve the user record from the users table
      const userQuery = "SELECT * FROM users WHERE email = ?";
      connection.query(userQuery, [email], (userError, userResults) => {
        if (userError) {
          console.error('Error during user login:', userError);
          return res.status(500).json({ message: 'An error occurred during login.' });
        }
  
        if (userResults.length === 0) {
          // User not found in the users table, check admin table
          const adminQuery = "SELECT * FROM admin WHERE email = ?";
          connection.query(adminQuery, [email], (adminError, adminResults) => {
            if (adminError) {
              console.error('Error during admin login:', adminError);
              return res.status(500).json({ message: 'An error occurred during login.' });
            }
  
            if (adminResults.length === 0) {
              // User not found in the admin table as well
              return res.status(401).json({ message: 'Invalid email or password.' });
            }
  
            const admin = adminResults[0];
            if (password !== admin.password) {
              // Passwords don't match
              return res.status(401).json({ message: 'Invalid email or password.' });
            }
  
            // Return a success message for admin login
            res.json({ admin });
          });
        } else {
          const user = userResults[0];
          if (password !== user.password) {
            // Passwords don't match
            return res.status(401).json({ message: 'Invalid email or password.' });
          }
  
          // Return a success message for user login
          res.json({ user });
        }
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

   // to ge the list of all the subjects on userLanding page 

 app.get("/api/get/subjects" , (req , res)=>{

    try{
        connection.query("SELECT * FROM subjects " , (err , result)=>{

            if(err){
                console.log("error in fetching data", err)

                res.status(500).json({message : "error in fetching data"})
            }

            res.send({result});
        })

    }catch (err){
        console.log("error in fetching dat")
        res.status(400).json({ message : "server side error"})


    }
 })


// get subject related questions based on subject id 

app.get("/api/get/subject/:subjectIDD", (req, res) => {
    const subId = req.params.subjectIDD;
  
    try {
      connection.query(
        "SELECT * FROM subjects WHERE subject_id = ?",
        [subId],
        (err, result) => {
          if (err) {
            console.log("Error in getting subject details", err);
            res.status(500).json({ message: "Error in getting subject details" });
          } else {
            if (result.length === 0) {
              res.status(404).json({ message: "Subject not found" });
            } else {
              res.json({ result });
            }
          }
        }
      );
    } catch (err) {
      console.log("Error in getting subject details", err);
      res.status(400).json({ message: "Server-side error to get subject details" });
    }
  });



  // getting questons based on subjectid 

  
  app.get("/api/get/subject/questions/:subjectIDD", (req, res) => {
    const subId = req.params.subjectIDD;
  
    try {
      connection.query(
        "SELECT s.*, q.* FROM subjects s INNER JOIN questions q ON s.subject_id = q.subject_id WHERE s.subject_id = ?",
        [subId],
        (err, result) => {
          if (err) {
            console.log("Error in getting subject details", err);
            res.status(500).json({ message: "Error in getting subject details" });
          } else {
            if (result.length === 0) {
              res.status(404).json({ message: "Subject not found" });
            } else {
              res.json({ result });
            }
          }
        }
      );
    } catch (err) {
      console.log("Error in getting subject details", err);
      res.status(400).json({ message: "Server-side error to get subject details" });
    }
  });
  
  //we made it ...!!! 
  app.post("/api/questions/:subjectId", (req, res) => {
    const subId = req.params.subjectId;
    const { question_text, options, answer } = req.body;
  
    try {
      const optionsJson = JSON.stringify(options);
  
      connection.query(
        "INSERT INTO questions (question_text, options, answer, subject_id) VALUES (?, ?, ?, ?)",
        [question_text, optionsJson, answer, subId],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error inserting data");
          } else {
            res.send("Data inserted successfully!");
          }
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).send("Error");
    }
  });
  
  










