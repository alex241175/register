const functions = require('firebase-functions');
const cors = require("cors");
const express = require("express");
const app = express(); 
const admin = require('firebase-admin');

const db = admin.initializeApp().firestore();

app.use(cors({ origin: true }));

app.post("/create", async (request, response) => {
   //const postData = request.body;

   response.send("new event imported via api.");
   return

   const event = {
        title: postData.title,
        category: postData.category,
        start: postData.start,
        end: postData.end,
        location: postData.location,
        head: postData.head,
        speaker: postData.speaker,
        service: postData.service,
        remark: postData.remark,
        dateAdded: new Date()
   }

    // get new document id
    let newId = '1'
    const snap = await db.collection('events').orderBy('dateAdded','desc').limit(1).get()
    if (snap.size > 0){
        newId = ((Number)(snap.docs[0].id) +  1).toString()
    }

    await db.collection('events').doc(newId).set(event)
    
    response.send("new event imported via api.");
    
})

exports.register = functions.https.onRequest((request, response) => {
    if (!request.path) {
        request.url = `/${request.url}`; // prepend '/' to keep query params if any
    }
    return app(request, response);
});
