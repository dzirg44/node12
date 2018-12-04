require('log-timestamp');
const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const os = require('os');
const Prometheus = require('./util.js');
const mongoClient = mongo.MongoClient;
const cookieParser = require('cookie-parser')

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
console.log('App started!');

let isReady = false;

// This is a simple function.
function getRootResponse(req) {
    return os.hostname() + '<h1>Hello World!</h1><p>This is a simple response to a <b>GET</b> request on the base path</p>\n';
}

console.log('Registering routes');
app.get('/', (req, res) => {
    console.log('Cookies: ', req.cookies)
    // Cookies that have been signed
    console.log('Signed Cookies: ', req.signedCookies)
    console.log(`Received a GET request on ${req.path} from ${req.hostname}`);
    res.send(getRootResponse(req));
    console.log(`Response sent for GET ${req.path} to ${req.hostname}`);
});

// MONITORING: heartbeat
app.get('/health', (req, res) => {
    res.sendStatus(200);
});

app.get('/readiness', (req, res) => {
    let status = isReady ? 200 : 500;
    res.sendStatus(status);
});

//  CONFIG: define
let mongoHost = process.env.MONGO_HOST;
let mongoPort = process.env.MONGO_PORT;
let dbName = process.env.MONGO_DB_NAME;
let appPort = Number(process.env.APP_PORT);

if (!mongoHost) {
    mongoHost = '34.174.101.55';
    console.log(`MONGO_HOST not specified, using default mongoHost: ${mongoHost}`);
}

if (!mongoPort) {
    mongoPort = 27017;
    console.log(`MONGO_PORT not specified, using default mongoPort: ${mongoPort}`);
}

if (!dbName) {
    dbName = 'mydb';
    console.log(`MONGO_DB_NAME not specified, using default dbName: ${dbName}`);
}

if (!appPort) {
    appPort = 3000;
    console.log(`PORT not specified, using default port: ${appPort}`);
}

let url = `mongodb://${mongoHost}:${mongoPort}`;
let db;

// DATABASE: connect
let maxAttempts = 20;
for (let attempt = 0; attempt < maxAttempts; attempt++) {
    function attemptConnection() {
        if (!isReady) {
            console.log(`Connecting to url for ${attempt + 1} attempt: ${url}`);
            mongoClient
                .connect(url, function (err, client) {
                    if (err) {
                        console.log('Unable to connect to the database, retrying');
                    } else {
                        db = client.db(dbName);
                        isReady = true;
                        console.log("Database connected");
                        const collection = db.collection("users");
                        let user = { _id: 1, name: "Oleg", age: 35};
                        collection.insertOne(user, function(err, result){
                          if(err){
                            return console.log(err);
                          }
                          console.log(result.ops);
                          console.log("1 document inserted");
                              });
                        }
                });
        }
    }

    setTimeout(attemptConnection, attempt * 2 * 1000);
}
// Prometheus //
/**
 * The below arguments start the counter functions
 */
app.use(Prometheus.requestCounters);  
app.use(Prometheus.responseCounters);

/**
 * Enable metrics endpoint
 */
Prometheus.injectMetricsRoute(app);

/**
 * Enable collection of default metrics
 */
Prometheus.startCollection();

// API: user methods //
app.get('/users', (req, res) => {
    console.log(`Received a GET request on ${req.path} from ${req.hostname}`);
    let allUsers = db.users;
    db.collection("users").find({}).toArray(function(err, result) {
          if (err) throw err;
          res.send(result);
    });
    console.log(`Response sent for GET ${req.path} to ${req.hostname}`);
});

app.post('/users', (req, res) => {
    console.log(`Received a POST request on ${req.path} from ${req.hostname}`);
    
    res.send('Success!');
    console.log(`Response sent for POST ${req.path} to ${req.hostname}`);
});

app.listen(appPort, () => console.log(`Example app listening on port ${appPort}!`));
