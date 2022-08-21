const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "/view/index.html"));
});

app.get("/messages", (req, res) => {
	var messagejson = fs.readFileSync(
		path.join(__dirname, "/data/data.json"),
		"utf-8"
	);
	res.send(messagejson);
});

app.post("/messages", (req, res) => {
	io.emit("message", req.body);
	let messagejson = fs.readFileSync(
		path.join(__dirname, "/data/data.json"),
		"utf-8"
	);
	let messages = JSON.parse(messagejson);
	console.log(messages);
	messages.push(req.body);
	messagejson = JSON.stringify(messages);
	fs.writeFileSync(
		path.join(__dirname, "/data/data.json"),
		messagejson,
		"utf-8"
	);
	res.sendStatus(200);
});

server.listen(port, () => {
	console.log(`Example app is listening on ${port}`);
});
