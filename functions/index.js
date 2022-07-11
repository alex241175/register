const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.register = functions.https.onRequest(async (req, res) => {

   const event = {
        title: req.query.title,
        category: req.query.category,
        start: req.query.start != 'undefined' ? new Date(req.query.start) : '', // convert ISO string '2022-07-21T09:35:31.820Z' to date object
        end: req.query.end != 'undefined' ? new Date(req.query.end) : '',
        location: req.query.location != 'undefined' ? req.query.location : '',
        head: req.query.head != 'undefined' ? req.query.head : '',
        speaker: req.query.speaker != 'undefined' ? req.query.speaker : '',
        service: req.query.service  != 'undefined'? req.query.service : '',
        remark: req.query.remark != 'undefined'? req.query.remark  : '',
        mode: req.query.mode,
        dateAdded: new Date()
   }

  const db = admin.firestore();

  // get new document id
  let newId = '1'
  const snap = await db.collection('events').orderBy('dateAdded','desc').limit(1).get()
  if (snap.size > 0){
      newId = ((Number)(snap.docs[0].id) +  1).toString()
  }

  db.collection('events')
  .doc(newId)
  .set(event)
  .then(() => {
    res.status(200).send('new event imported via api');
  })
  return;
})
