const express = require('express');
const router = express.Router();
const { Notification, validateNotification, validateObjectId } = require('../models/notification');
const { File } = require('../models/file');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { uploadNotificationImage } = require('../utils/upload');
const _ = require('lodash');
const { deleteFiles, deleteDatabaseFiles } = require('../utils/unlinkFiles');


// GET: Get all the notifications
router.get('/', [auth, admin], async(req, res, next) => {

    const notifications = await Notification.find()
                                            .select('title description files')
   
    res.send(notifications);

});


// Get : Get a notification by Id
router.get('/:id', [auth, admin], async(req, res, next) => {

    const { error } = validateObjectId({id: req.params.id});
    if(error) return res.status(400).send(error.details[0].message);

    let notification = await Notification.findById(req.params.id);
    res.send(notification);
});


// POST :  Create a new notification
router.post('/', [auth, admin], async(req, res, next) => {

    uploadNotificationImage(req, res, async function(err) {
        if(err){
            return res.status(400).send('Invalid file type');
        }

        const { error } = validateNotification(req.body);
        if(error) {
            // Remove files from upload folder if file exists and body content is missing
            if(req.files) deleteFiles(req.files);
            return res.status(400).send(error.details[0].message);
        } 

        let notification = new Notification({
            title: req.body.title,
            description: req.body.description
        });
        
        if(req.files){
            req.files.forEach(element => {
                const file = new File({
                    name: element.originalname,
                    fullPath: element.path,
                    relativePath: `/public/uploads/${element.filename}`
                })
                notification.files.push(file);
            });
        }
        await notification.save();
        res.send(notification);
    })
});


// Delete a notification
router.delete('/:id', [auth, admin], async(req, res, next) => {

    const { error } = validateObjectId({id: req.params.id});
    if(error) return res.status(400).send(error.details[0].message);

    const notification = await Notification.findByIdAndDelete({_id: req.params.id});
    if(!notification) return res.status(400).send('Notification does not exist');

    deleteDatabaseFiles(notification.files);
    res.send(_.pick(notification, ['name', 'description', 'files']));
});


module.exports = router;