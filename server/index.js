require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const meetupRoutes = require('./routes/meetups');
const discussionRoutes = require('./routes/discussion');
const userRoutes = require('./routes/user');
const friendsRoutes = require('./routes/friends');
const notificationsRoutes = require('./routes/notifications');
const userNotificationsRoutes = require('./routes/userNotifications');
const groupNotificationsRoutes = require('./routes/groupNotifications');
const groupsRoutes = require('./routes/groups');
const groupRequestsRoutes = require('./routes/groupRequests');

const commentRoutes =  require('./routes/comment');
const groupChatRoutes = require('./routes/groupChat');
const meetupChatRoutes = require('./routes/meetupChat');

const cors = require('cors');
const Pusher = require('pusher');

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

//routes
app.use('/api/meetups', meetupRoutes);
app.use('/api/discussions', discussionRoutes)
app.use('/api/user', userRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/user-notifications', userNotificationsRoutes);
app.use('/api/group-notifications', groupNotificationsRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/group-requests', groupRequestsRoutes);

app.use('/api/comments', commentRoutes);
app.use('/api/group-chat', groupChatRoutes);
app.use('/api/meetup-chat', meetupChatRoutes);
app.use('/api/comments', commentRoutes);


const pusher = new Pusher({
    appId: "1638539",
    key: "4a38210c30f8213a34a9",
    secret: "6f10b3010c2a0aa79b06",
    cluster: "ap1",
    useTLS: true
});

pusher.trigger("sportify-chat", "connect", {
    message: "hello world"
});

app.post('/pusher/chat/:groupId', (req, res) => {
    const {groupId} = req.params;
    const event = `chat-event-${groupId}`;
    pusher.trigger("sportify-chat", event, req.body.message)
})

app.post('/pusher/meetup-chat/:meetupId', (req, res) => {
    const {meetupId} = req.params;
    const event = `meetup-chat-event-${meetupId}`;
    pusher.trigger("sportify-chat", event, req.body.message)
})



//connect to DB
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('connected to database');
        app.listen(PORT, () => {
            console.log(`connected to DB and listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });

app.get('/', (req, res) => {
    res.json({msg: 'welcome'});
});



