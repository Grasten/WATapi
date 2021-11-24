const express = require('express');
const http = require('http');
const logger = require('morgan');
const bodyParser = require('body-parser');
const db = require('./db');
const cors = require('cors');

(async () => {
  const app = express();

  app.use(logger('dev'));

  app.use(cors());

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

  app.get("/", (req, res) => {
    res.send("running")
  })

  app.get("/activities", (req, res) => {
    (async() => {
      res.json(await db.client.all('SELECT * FROM activity_history'))
    })()
  })

  app.post("/activities", (req, res) => {
    (async() => {
      try{
        const result = await db.client.run(
          'INSERT INTO activity_history VALUES (null, :type, :distance, :start_time, :finish_time, :date)',
           {
              ':type': req.body.type,
              ':distance': req.body.distance,
              ':start_time': req.body.start_time,
              ':finish_time': req.body.finish_time,
              ':date': Math.floor(Date.now() / 1000)
            })
        res.json(result);
      } catch (e) {
        console.log(e)
      }
    })()
  })

  app.set('port', process.env.PORT || 3001)

  await db.connect();
  const server = http.createServer(app);
  server.listen(app.get('port'), () => {
    console.log('Express started on port', app.get('port'));
  })
})();


