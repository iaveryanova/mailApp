const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const mysql_async = require('mysql2/promise');
const bodyParser = require('body-parser');
const config = require("./config");

const app = express();
const port = 3021;



app.use(cors({
    origin: "http://task6.io-dev.avehub.ml",
    credentials: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/api/login', async (req, res) => {

    let login = req.body.name;
    let connection = await mysql_async.createConnection(config);
    connection.connect();
    const [rows, fields] = await connection.query('select * from users where name=?', [login]);
    connection.end();
    if(rows.length > 0){
        res.send(rows.pop());
        return;
    }
    else{
        connection = await mysql_async.createConnection(config);
        connection.connect();
        const [rows, fields] = await connection.execute('insert into users (name) values (?)',[login]);
        const user = {id: rows.insertId, name: login};
        res.send(user);
        return;
    }

});


app.get('/api/users', async (req, res) => {
    let connection = await mysql_async.createConnection(config);
    connection.connect();
    const [rows, fields] = await connection.query('select * from users order by name');
    connection.end();
    res.send(rows);
    return;
});


app.post('/api/check-new-mails', async (req, res) => {

    let user_to_id = req.body.user_id;
    let connection = await mysql_async.createConnection(config);
    connection.connect();
    const [rows, fields] = await connection.query('select count(id) as new_mails from mails where user_to_id=? and is_read=0', [user_to_id]);
    connection.end();
    res.send(rows.pop());
    return;
});

app.post('/api/incoming-mails', async (req, res) => {
    let user_to_id = req.body.to_user_id;
    let connection = await mysql_async.createConnection(config);
    connection.connect();
    
    
    const [rows, fields] = await connection.query('' +
    'select m.*, user_to.id as user_to_id, user_to.name as user_to_name, user_from.id as user_from_id, user_from.name as user_from_name from mails as m left join users as user_from on m.user_from_id = user_from.id left join users as user_to on m.user_to_id = user_to.id where  user_to_id=? order by id desc',
    [user_to_id]
);

const result = rows.map((row)=>{
    const date = new Date(row.created_at);

    return {
        id: row.id,
        subject: row.subject,
        body: row.body,
        user_from: {
            id: row.user_from_id,
            name: row.user_from_name
        },
        user_to:{
            id: row.user_to_id,
            name: row.user_to_name
        },
        created_at: date.toLocaleString(),
        is_read: row.is_read,
    }
})
connection.end();
res.send(result);
    return;
});

app.post('/api/sent-mails', async (req, res) => {
    let user_from_id = req.body.from_user_id;
    let user_to_id = req.body.to_user_id;
    let connection = await mysql_async.createConnection(config);
    connection.connect();
    const [rows, fields] = await connection.query('' +
        'select m.*, user_to.id as user_to_id, user_to.name as user_to_name, user_from.id as user_from_id, user_from.name as user_from_name from mails as m left join users as user_from on m.user_from_id = user_from.id left join users as user_to on m.user_to_id = user_to.id where user_from_id=? and user_to_id=? order by id DESC',
        [user_from_id, user_to_id]
    );

    const result = rows.map((row)=>{
        const date = new Date(row.created_at);

        return {
            id: row.id,
            subject: row.subject,
            body: row.body,
            user_from: {
                id: row.user_from_id,
                name: row.user_from_name
            },
            user_to:{
                id: row.user_to_id,
                name: row.user_to_name
            },
            created_at: date.toLocaleString(),
            is_read: row.is_read,
        }
    })
    connection.end();
    res.send(result);
    return;
});


app.post('/api/create-message', async (req, res) => {
    let subject = req.body.title;
    let body = req.body.message;
    let user_to_id = req.body.userTo.id;
    let user_from_id = req.body.userFrom.id;

    let connection = await mysql_async.createConnection(config);
    connection.connect();
    const [rows, fields] = await connection.execute('insert into mails (subject, body, user_to_id, user_from_id) values (?,?,?,?);',
        [subject, body, user_to_id, user_from_id]);
    res.send(rows);
    return;

})

app.post('/api/read-mail', async (req, res) => {

    let mail_id = req.body.id;

    let connection = await mysql_async.createConnection(config);
    connection.connect();
    const [rows, fields] = await connection.execute('update mails set is_read=1 where id=?',
        [ mail_id]);
    res.send(rows);
    return;

})




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});