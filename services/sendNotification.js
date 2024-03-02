var FCM = require("fcm-node");
var serverKey = process.env.FIREBASE_SERVER_KEY;
var fcm = new FCM(serverKey);
const Notification = require("../model/Notification");
var mongoose = require("mongoose");

const SendNotification = async ({
  user,
  reciever_user,
  type,
  create,
  onDone,
}) => {
  let body = "";
  //TODO: chnage body by type and user

  var message = {
    to: reciever_user.notification_token,
    notification: {
      title: "Kısmet Çarkı",
      body: body,
    },
  };

  if (create !== false) {
    Notification.create({
      owner_id: reciever_user._id,
      type: type,
      related_id: user._id,
      readed: false,
    });
  }

  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong! " + err);
      console.log("Respponse:! " + response);
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });

  onDone();
};

module.exports = SendNotification;
