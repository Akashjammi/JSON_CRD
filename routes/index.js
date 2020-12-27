const express = require('express');
let db = require('../db');
const fs = require('fs');

module.exports = (app)=>{
app.use(express.json());   
app.post('/create',async (req,res)=>{
    if(Buffer.from(JSON.stringify(db)).length >1000000000){
        res.send('Database is full,please delete before insert');
    }else{
    const json = req.body;
    if(json.filepath && json.filepath.path){
        db = await require(json.filepath.path);
    }
    console.log(`Insert Key ${JSON.stringify(json)}`);
    const keysAlready = [];
    const keysAdded = [];
    for (const key of Object.keys(json)) {
        console.log(typeof json[key]);
        if(typeof key!= 'string'
             || key.length>32 
             || typeof json[key]!= 'object' 
             || Buffer.from(JSON.stringify(json[key])).length >16000
             ){
                 res.send(`Input payload validation failure`);
                break;

             }
        if(key in db){
            console.log(`${key} Allready exists!`);
            
            keysAlready.push(key);
            
        }else{
            keysAdded.push(key);
            if("timeToLive" in json[key]){
                let t = new Date();
                t.setSeconds(t.getSeconds() + json[key].timeToLive);
                json[key].expiryTime = t;
            }
            db[key]=json[key];
        }
    }
    console.log(JSON.stringify(db));
    fs.writeFile("db.json", JSON.stringify(db), err => { 
         if (err) throw err;  
         console.log("Done writing");  
    }); 
    
    res.json({keysAdded,keysAlready});

    }


});


app.post('/read',async (req,res)=>{
    const keys = req.body.keys.split(',');
    if(req.body.filepath && req.body.filepath.path){
        db = await require(req.body.filepath.path);
    }
    let resJson = {};
    keys.forEach(element => {
        if(db[element].expiryTime 
            && db[element].expiryTime.getTime() > new Date().getTime()){
                resJson[element] = db[element];
            }else{
                console.log(`Timeout`);
                res.send(`Timeout`);
            
            }
        
    });
    res.json(resJson);
});


app.post('/delete',async (req,res)=>{
    const keys = req.body.keys.split(',');
    if(req.body.filepath && req.body.filepath.path){
        db = await require(req.body.filepath.path);
    }
    
    keys.forEach(element => {

        if(element in db){
            if(db[element].expiryTime 
                && db[element].expiryTime.getTime() > new Date().getTime()){
                    delete db[element];
                }
             else if(!db[element].expiryTime)       
                 delete db[element];
             else 
                {
                    console.log(`Timeout`);
                    res.send(`Timeout`);
            
                }   
        }else{
            console.log(`${element} not present`);
        }
    });
    fs.writeFile("db.json", JSON.stringify(db), err => { 
        if (err) throw err;  
        console.log("Done writing");  
   }); 
   res.send(`success`) 
});
}
    
