const express = require('express');
const dotenv = require('dotenv');
dotenv.config()
<<<<<<< HEAD
const port = process.env.PORT || 3000;
=======
const port = 3001;
>>>>>>> main
const app = express();
const { sequelize } = require('./models')
const youtubeapi = require('./routes/youtubeAPI')
const publicApt = require('./routes/pubOpenAPI')
const privateApt = require('./routes/privateApt');
const imgCrawl = require('./routes/imgCrawl');
const privateAptDetail = require('./routes/privateAptDetail');

const privateCron = require('./crons/privateCron')
const privateCron2 = require('./crons/privateCron2')
const privateImgCron = require('./crons/privateImgCron')

const publicCron = require('./crons/publicCron')
const publicCron2 = require('./crons/publicCron2')

const youtubeCron = require('./crons/youtubeCron')
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
app.use('/privateApt', privateApt);
app.use('/imgCrawl', imgCrawl);
app.use('/privateAptDetail', privateAptDetail);

//error
app.use((req, res, next) => {
    res.sendStatus(404);
});
app.use((error, req, res, next) => {
    console.error(error);
    res.sendStatus(500);
});

publicCron.dailyPublicData();
publicCron2.dailyPublicData2();

privateCron.dailyPrivateData();
privateCron2.dailyPrivateData2();
privateImgCron.dailyPrivateDataImg();

youtubeCron.monthlyYoutubeData();
app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
})
