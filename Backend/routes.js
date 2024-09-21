const express = require("express");
const router = express.Router();
const controller = require("./controller");
router.use(express.json());

//Users
router.post("/login",controller.logIn);
router.post("/signup", controller.signup);


//Chat Room

router.post("/createroom",controller.createRoom);
router.post("/getrooms",controller.getRooms);

router.post("/getmessages", controller.getRoomMessages);
router.get("/getroomusers",controller.getUsernameOfRoom);
router.post("/savemessage", controller.saveMessage);
router.post("/updateseen",controller.updateSeen);

router.get("/getallusers",controller.getAllUsernames);


module.exports = router;
