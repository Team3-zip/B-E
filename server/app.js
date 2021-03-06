const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output');
const dotenv = require('dotenv');
dotenv.config()
// const port =process.env.PORT;
const port = 3000

const app = express();
const { sequelize } = require('./models')
const indexRouter = require('./routes/index');

const corsOptions = {
    origin: '*', // 나중에 여기에 url
    credentials: true,
};
app.use(cors(corsOptions));

//db 연결
sequelize
    .sync({ force: false })
    .then(() => {
        console.log('db Connected!!!!!!')
    })
    .catch((err) => {
        console.log(err);
    });

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(express.json());

//router
app.use('/api', indexRouter);

//error
app.use((req, res, next) => {
    res.sendStatus(404);
});
app.use((error, req, res, next) => {
    console.error(error);
    res.sendStatus(500);
});


app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
})
