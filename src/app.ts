// This is the low-level 'Node' way of using the 'http' module
// import http, { request } from 'node:http';

/**
 * Express acts as your HTTP router and middleware controller framework. It abstracts the low-level server logic so you can write clean endpoints:
• Routing Matrix: It maps incoming HTTP Verbs (GET, POST, PUT) and URL patterns straight to specific controller methods. 
    Without Express, you would have to write a massive switch(req.url) statement parsing every string parameter manually.
• Middleware Pipeline: It handles cross-cutting concerns (like parsing JSON body strings into JavaScript objects, logging, or setting CORS headers) sequentially before your business logic runs.
 */
// This way of using 'express' will enable the handling of http routing.
import express from 'express';
// Pull the types directly from the Express namespace context
import type { Request, Response } from 'express'; 
// The ODM (object document mapper)
import mongoose from 'mongoose';
import { MONGODB_CONNECTION_STRING, DB_CONNECTION_PATHS } from './config/constants.ts';
import { Employee } from './models/Employee.ts';
const app = express();
// enables node to use express
app.use(express.json());
const PORT: number = 8000;
// Replace 'tracking_app' with the exact database name containing employeeCollection
const MONGO_URI = MONGODB_CONNECTION_STRING + DB_CONNECTION_PATHS.LEARNING_DB_URI;

// ---------- old way --------
// Create the server instance
// const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse): void => {
  // Set the response headers
  // res.writeHead(200, { 'Content-Type': 'text/plain' });
  
  // Send the response body
  // res.end('Hello from your native Node.js 26 TypeScript server!\n');
// });
// ----------- old way --------

// ---------- old way --------
// Start listening on the port
// server.listen(PORT, (): void => {
  // console.log(`Server is running smoothly at http://localhost:${PORT}/`);
// });
// ---------- old way --------

// ---- Industry standard way - using Express -------
// Express routes replace the manual `http.createServer` switch block
app.get('/',(req: Request, res: Response): void => {
  // Express handles headers and status codes automatically
  res.status(200).send({data:'Hello from your Express TypeScript server!'});
});

/**
 * NEW ENDPOINT: GET /api/employees
 * Fetches all records from employeeCollection with optional department query filter
 */
app.get('/api/employees', async (req: Request, res: Response): Promise<void>=>{
  try{
    const {dept} = req.query;
    // Explicit query typing matching our MongoDB schema requirements
    const filter = dept ? { department: String(dept) } : {};
    // Executes asynchronously, benefiting from our typed Mongoose model definition
    const employees = await Employee.find(filter).maxTimeMS(2000);
    console.log(` Found ${employees.length} entries`);
    res.status(200).json(employees);
  }catch(error: any){
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
});

app.post('/api/add-employee', async(req: Request, res: Response): Promise<void>=>{
  try{
    // adding a new employee
    const savedEmployee = 
    await Employee.create(req.body);
    console.log(`Successfully added an employee: ${savedEmployee.name}`);
    res.status(201).json(savedEmployee);
  }catch(error: any){
    res.status(500).json({message: 'Error adding an employee', error: error.message});
  }
});

// ---- Industry standard way - using Express -------

// 1. Establish the database connection alongside your server startup sequence
mongoose.connect(MONGO_URI)
        .then(()=>{
          console.log('✅ MongoDB connected securely via Mongoose (v8+)')
          // Express handles its own listener setup
          app.listen(PORT, (): void=>{
          console.log(`Server is running smoothly at http://localhost:${PORT}/`);
        });
        })
        .catch(err=>console.error('MongoDB connection error: ',err));
