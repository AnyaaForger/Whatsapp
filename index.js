const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
require('dotenv').config();

const APP_ID = "7f0c44cc-ed56-40fc-b2ea-8fa61cab2231";

const app = express().use(body_parser.json());

const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;

// console.log(token + mytoken);

app.listen(process.env.PORT, () =>{
    console.log("Jalannn...");
});

app.get("/webhook", (req,res)=>{
    let mode = req.query["hub.mode"];
    let challenge = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];

    console.log(challenge);

    if(mode && token){
        if(mode === "subscribe" && token === mytoken){
            res.status(200).send(challenge);
        }else{
            res.status(403);
        }
    }
});

app.post("/webhook", (req, res)=>{
    let body_param = req.body;
    console.log(JSON.stringify(body_param, null, 2));
    if(body_param.object){
        if(body_param.entry && 
            body_param.entry[0].changes && 
            body_param.entry[0].changes[0].value.message && 
            body_param.entry[0].changes[0].value.message[0]){
                let phone_no_id = req.body.entry[0].changes[0].value.metadata.phone_no_id;
                let from = req.body.entry[0].changes[0].value.message[0].from;
                let msg_body = req.body.entry[0].changes[0].value.message[0].text.body;

                axios({
                    method:"POST",
                    url:"https://graph.facebook.com/v17.0/" + phone_no_id + "/messages?access_token=" + token,
                    data:{
                        messaging_product:"whatsapp",
                        to: from,
                        text:{
                            body:"HELLOOOOO!!!!!!"
                        }
                    },
                    headers:{
                        "Content-Type": "application/json"
                    }
                });

                res.sendStatus(200);
            }else{
                res.sendStatus(404);
            }
    }
})

app.get("/", (req, res)=>{
    res.status(200).send("This is webhook.");
});