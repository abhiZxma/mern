const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const util = require('./extraUtil')
const uuid = require('uuid');

router.get('/', (req, res) => {
    res.status(200).send("MY NODE APP")
})

router.post('/userregistration', async (req, res) => {
    try {
        let validationError = []
        console.log("req.body",req.body)
        let body = JSON.parse(req.body)
        body.phone ? true : validationError.push({ "field": "phone", "error": "mandatory parameter missing" })
        if (validationError.length == 0) {
            let otp = util.otpGenerate()
            let guid = uuid.v4()
            let insertData = await db.collection("user").insertOne({
                "phone": body.phone,
                "_id": guid,
                "otp": otp
            })
            if (insertData.acknowledged) {
                res.status(200).json({ "success": true, "id": insertData.insertedId,"otp": otp })
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Error while inserting record"
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Mandatory parameter(s) are missing.",
                validationError: validationError
            })
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})
router.post('/verifyotp', async (req, res) => {
    try {
        let validationError = []
        let body = JSON.parse(req.body)
        body.phone ? true : validationError.push({ "field": "phone", "error": "mandatory parameter missing" })
        body.otp ? true : validationError.push({ "field": "otp", "error": "mandatory parameter missing" })
        if (validationError.length == 0) {
            console.log("body",body)
            let getData = await db.collection("user").find({ "phone": body.phone, "otp": body.otp }).toArray()
            if (getData.length > 0) {
                res.status(200).json({ "success": true, "message": "otp verified" })
            } else {
                res.status(200).json({
                    success: false,
                    message: "wrong otp"
                })
            }
            if (insertData.acknowledged) {
                res.status(200).json({ "success": true, "id": insertData.insertedId })
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Error while inserting record"
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Mandatory parameter(s) are missing.",
                validationError: validationError
            })
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})
router.post('/createImageRecord', async (req, res) => {
    try {
        let validationError = []
        let body = JSON.parse(req.body)
        body.image_title ? true : validationError.push({ "field": "image_title", "error": "mandatory parameter missing" })
        body.image_desc ? true : validationError.push({ "field": "image_desc", "error": "mandatory parameter missing" })
        body.image ? true : validationError.push({ "field": "image", "error": "mandatory parameter missing" })
        if (validationError.length == 0) {
            let otp = util.otpGenerate()
            let guid = uuid.v4()
            let insertData = await db.collection("images").insertOne({
                "_id": guid,
                "image_title": body.image_title,
                "image_desc": body.image_desc,
                "image": body.image,
                "category": body.category,
                "item_for_sale": body.item_for_sale,
                "item_price": body.item_for_sale,
                "accept_term_and_cond": body.accept_term_and_cond
            })
            if (insertData.acknowledged) {
                res.status(200).json({ "success": true, "id": insertData.insertedId })
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Error while inserting record"
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Mandatory parameter(s) are missing.",
                validationError: validationError
            })
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }

})
router.post('/updateImageRecord', async (req, res) => {
    try {
        let validationError = []
        let body = JSON.parse(req.body)
        body.id ? true : validationError.push({ "field": "id", "error": "mandatory parameter missing" })
        if (validationError.length == 0) {
            let update_to_be = {}
            Object.keys(body).map((key) => {
                if (key != 'id') {
                    update_to_be[key] = body[key]
                }
            })
            console.log("update_to_be", update_to_be)
            let updateData = await db.collection("images").updateOne({ "_id": body.id }, { $set: update_to_be })
            console.log("updateData", updateData)
            if (updateData.acknowledged) {
                res.status(200).json({ "success": true, "message": "updated succesfully" })
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Error while updating record"
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Mandatory parameter(s) are missing.",
                validationError: validationError
            })
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})
router.get('/getAllrecords', async (req, res) => {
    let validationError = []
    try {
        if (validationError.length == 0) {
            let filer = {}
            if (req.query.id) {
                filer = { "_id": req.query.id }
            }
            let getData = await db.collection("images").find(filer).toArray()
            if (getData.length > 0) {
                res.status(200).json({ "success": true, "count": getData.length, "data": getData })
            } else {
                res.status(200).json({
                    success: false,
                    message: "no data found"
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Mandatory parameter(s) are missing.",
                validationError: validationError
            })
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }

})
router.post('/deleterecord', async (req, res) => {
    try {
        let validationError = []
        let body = JSON.parse(req.body)
        body.id ? true : validationError.push({ "field": "id", "error": "mandatory parameter missing" })
        if (validationError.length == 0) {
            let deleteData = await db.collection("images").findOneAndDelete({ "_id": body.id })
            console.log("deleteData",deleteData)
            if (deleteData.ok) {
                res.status(200).json({ "success": true, "message": "deleted succesfully" })
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Error while deleting record"
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Mandatory parameter(s) are missing.",
                validationError: validationError
            })
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})

router.post('/uploadImage', util.upload.single('image'), async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            "url":`${req.file.destination}/${req.file.filename}`,
            message: "file uploaded succesfully"
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})

module.exports = router


// try {

// } catch (e) {
//     res.status(500).json({
//         success: false,
//         message: "Internal Server Error"
//     })
// }