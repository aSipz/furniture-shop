const express = require('express');

const cookieParser = require('cookie-parser');

const cors = require('cors');

const config = require('./config');
const routes = require('./routes');
const { connectDB } = require('./database/dbConnect');
const { authentication } = require('./middlewares/authMiddleware');
const { errorHandler } = require('./middlewares/errorHandler');

const PORT = process.env.PORT || config.PORT;

const app = express();

app.use(cors({
    credentials: true,
    origin: config.origin
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authentication);

app.use(routes);
app.use(errorHandler);

connectDB()
    .then(() => {
        app.listen(PORT, () =>
            console.log(`Server is listening on port ${PORT}...`));
    })
    .catch(err => console.log(err));