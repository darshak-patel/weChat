const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const mongoose = require("mongoose");

const uri =
	"mongodb+srv://admin:admin@learning-node.ieew2tb.mongodb.net/?retryWrites=true&w=majority";
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var Message = mongoose.model("Message", {
	name: String,
	message: String,
});

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "/view/index.html"));
});

app.get("/messages", (req, res) => {
	// var messagejson = fs.readFileSync(
	// 	path.join(__dirname, "/data/data.json"),
	// 	"utf-8"
	// );
	// res.send(messagejson);
	Message.find({}, (err, messages) => {
		res.send(messages);
	});
});

app.post("/messages", (req, res) => {
	var message = new Message(req.body);

	message.save((err) => {
		if (err) {
			console.log(err);
			sendStatus(500);
		} else {
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
		}
	});
});

mongoose.connect(uri, (err) => {
	console.log("mongo db connection", err);
});

server.listen(port, () => {
	console.log(`Example app is listening on ${port}`);
});
