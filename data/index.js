const express = require('express');
const dotenv = require('dotenv');
dotenv.config()
const port = process.env.PORT;
const app = express();
const { sequelize } = require('./models')
const youtubeapi = require('./routes/youtubeAPI')
const publicApt = require('./routes/pubOpenAPI')

//db 연결
sequelize
    .sync({ force: false })
    .then(() => {
        console.log('db Connected')
    })
    .catch((err) => {
        console.log(err);
    });

app.use(express.json());
app.use('/youtube', youtubeapi)
app.use('/publicApt', publicApt)

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
