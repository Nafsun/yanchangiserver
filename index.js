const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const typeDefs  = require("./typeDefs");
const resolvers = require("./resolvers");
const http = require("http");
const { ApolloServer } = require("apollo-server-express");
const bodyParser = require("body-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const hsts = require("hsts");
const dotenv = require("dotenv");
const xXssProtection = require("x-xss-protection");

dotenv.config();

const sixtyDaysInSeconds = 5184000;

const serverapollo = new ApolloServer({
    typeDefs,
    resolvers
});

const app = express();

app.use(cors());

app.use(express.json({limit:'15mb'}));

app.use(xXssProtection());

app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*'); //https://textailng.com
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,Content-Type,application/json,Authorization');
    res.set('X-Frame-Options', 'DENY');
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
});

app.use(bodyParser.json());

app.use(mongoSanitize()); //Sanitize mongodb queries

app.use(helmet());

app.use(hsts({maxAge: sixtyDaysInSeconds}));

const server = http.createServer(app);

app.get('/', (req, res) => {
    res.send('Welcome to Yanchangi');
});

app.get('/networkchecker', (req, res) => {
    res.json({ message: 'online' });
});

mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.MongodbHostGcloud : process.env.DevMongodbHost, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("database connected")).catch((e) => console.log(e));

serverapollo.applyMiddleware({app});

const port = process.env.PORT || process.env.NODE_ENV === 'production' ? 8080 : 5000;

server.listen(port, () => {
    console.log(`Server started running on port: ${port} http://localhost:5000${serverapollo.graphqlPath}`);
});