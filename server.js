const express = require('express');
const app = express();
const mssql = require('mssql');
//const mssql = require('mssql/msnodesqlv8');
require('dotenv').config();

// Enable CORS headers
app.use((req, res, next) => {
   res.setHeader('Cache-Control', 'no-cache');
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
   next();
});

const config = {
   user: 'adminmanager',
   password: 'Wspdb123@',
   server: 'autodeskhealth.database.windows.net',
   database: 'vkdatabase',      
   options: {
      encrypt: true,      
      trustServerCertificate: false // Change to true if you're using a self-signed certificate
   }
};

/*const config = {
  database: 'vkdatabase',
  server: 'localhost\\SQLSERVERONE',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
    enableArithAbort: true
  }
};*/

// Serve the index.html file
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'index.html'));
 });


// Endpoint to fetch data from the database
app.get('/api/data', async (req, res) => {
   try {
      await mssql.connect(config);
      const result = await mssql.query('SELECT ProcessName, ProcessId, MaxIdleTime, MachineName, ProcessTitle, UserName FROM Autodesk_Health');
      res.json(result.recordset);
   } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
   } finally {
      mssql.close();
   }
});

// Start the server
const port = process.env.PORT || 3000; // Use the environment variable PORT if available, otherwise use port 3000
app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});