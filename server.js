const express = require('express');
const login = require('facebook-chat-api');
const cors = require('cors');
const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());
app.listen(PORT, () => {
  console.log('App started at port ' + PORT);
});

app.post('/mention/:threadId', (req, res) => {
  const threadId = req.params.threadId;
  let { message = '@everyone', state } = req.body;
  message = message.length ? message : '@everyone';
  console.log(state);
  state = JSON.parse(state);

  login({ appState: state }, (err, api) => {
    if (err)
      return res.json({
        failed: true,
      });

    var msgToSend = {
      body: '\u200e' + message,
      mentions: [],
    };

    api.getThreadInfo(threadId, (err, data) => {
      data.participantIDs.map((id) => {
        if (id !== api.getCurrentUserID())
          msgToSend.mentions.push({ tag: message, id });
      });

      api.sendMessage(msgToSend, threadId, (err) => {
        if (err)
          return res.json({
            failed: true,
          });
        return res.json({
          success: true,
        });
      });
    });
  });
});
