/**
 * Created by harshitbisht96 on 25/7/17.
 */

var db=require('../database.js');
const express=require('express');
const route=require('express').Router();
function retreive() {
    route.get('/', function (req, res) {
    db.then(function (data) {

        var imagesDb = data.collection('images');
        imagesDb.find({}).toArray().forEach(function(obj){
         	// because the file path retrieved from the database is in the form of:
		    // /home/harshitbisht96/WebstormProjects/gridfsandmulter/uploa‌​ds/avatar-15015410‌​56‌​425.png
		    // we need to trim that down so that we can GET it from our /public directory
		    
        	obj.image = obj.image.split("gridfsandmulter")[1];
        }).then(function (data) {
            res.render('homepage', {data: data});
            })
        });
    });
    return route;
}

module.exports=retreive();