
const http = require('http');
const url = require('url');
const defaultHeader = {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"}
const PORT = process.env.PORT || 3000
const connection = require('./database.js');


http.createServer((req, res) => {
    const link = url.parse(req.url, true)
    const query = link.query;
    const pathname = link.pathname;

    connection.on('connection', (connection) => {
        console.log("Connected")
    });

    let sqlQuery = query.query ? query.query : `SELECT * FROM patient_info;`
    const noGoKeywords = ['DROP', 'UPDATE', 'PUT', 'DELETE'];
    const hasNoGoKeywords = noGoKeywords.some(keyword => sqlQuery.toUpperCase().includes(keyword));



    if (hasNoGoKeywords) {
        res.writeHead(400, defaultHeader);
        res.end(JSON.stringify({ message: 'Disallowed SQL query detected' }));
    }
    else if (req.method == 'GET' && pathname === '/execute') {
        console.log(sqlQuery)
        res.writeHead(200, defaultHeader);
        connection.query(sqlQuery, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.end(JSON.stringify(result));
        });
    } else if (req.method == 'POST' && pathname == '/execute') {
        res.writeHead(200, defaultHeader);
        connection.query(sqlQuery, (err, result) => {
            if (err) throw err;
            console.log(result);
        });
    ///For the button
    } else if (req.method == 'POST' && pathname == '/insertAll') {
        res.writeHead(200, defaultHeader);
        res.end(JSON.stringify({message: "Hello World"}))
        let sqlQuery = `INSERT INTO patient_info (patientName, patientDOB) VALUES ('Sara Brown', '1990-01-01'), ('John Smith', '1941-01-01'), ('Jack Ma', '1961-01-30'), ('Elon Musk', '1999-01-01');`
        connection.query(sqlQuery, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.end(JSON.stringify("Rows Inserted Successfully."));
        })
    }

    
}).listen(PORT)