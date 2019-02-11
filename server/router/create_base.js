'use strict'

var db = require('../db/db');
var sql = require('../db/requetes');
const express = require('express');
const router = express.Router();

router.get('/', (req, response) => {
    db.connection.query(sql.create_database, async (err, res) => {
        if (err) {
            console.log("CREATE DATABASE ERROR: ", err.message);
            return ;
        }
        console.log("CREATE DATABASE SUCCESS!");
        await db.connection_db.query(sql.create_table_users, (err, res) => {
            if (err)
                console.log("CREATE TABLE USERS ERROR: ", err.message);
            else
                console.log("CREATE TABLE USERS SUCCESS!");
        });
        await db.connection_db.query(sql.create_table_movies, (err, res) => {
            if (err)
                console.log("CREATE TABLE MOVIES ERROR: ", err.message);
            else
                console.log("CREATE TABLE MOVIES SUCCESS!");
        });
        await db.connection_db.query(sql.create_table_movies_viewed, (err, res) => {
            if (err)
                console.log("CREATE TABLE MOVIES VIEWED ERROR: ", err.message);
            else
                console.log("CREATE TABLE MOVIES VIEWED SUCCESS!");
        });
        await db.connection_db.query(sql.create_table_movies_genre, (err, res) => {
            if (err)
                console.log("CREATE TABLE MOVIES GENRE ERROR: ", err.message);
            else
                console.log("CREATE TABLE MOVIES GENRE SUCCESS!");
        });
        await db.connection_db.query(sql.create_table_movies_torrent, (err, res) => {
            if (err)
                console.log("CREATE TABLE MOVIES TORRENT ERROR: ", err.message);
            else
                console.log("CREATE TABLE MOVIES TORRENT SUCCESS!");
        });
        await db.connection_db.query(sql.create_table_movies_file, (err, res) => {
            if (err)
                console.log("CREATE TABLE MOVIES FILE ERROR: ", err.message);
            else
                console.log("CREATE TABLE MOVIES FILE SUCCESS!");
        });
        await db.connection_db.query(sql.create_table_movies_subtitle, (err, res) => {
            if (err)
                console.log("CREATE TABLE MOVIES SUBTITLE ERROR: ", err.message);
            else
                console.log("CREATE TABLE MOVIES SUBTITLE SUCCESS!");
        });
        await db.connection_db.query(sql.create_table_comments, (err, res) => {
            if (err)
                console.log("CREATE TABLE COMMENTS ERROR: ", err.message);
            else
                console.log("CREATE TABLE COMMENTS SUCCESS!");
        });
        await db.connection_db.query(sql.create_table_comments_movies_users, (err, res) => {
            if (err)
                console.log("CREATE TABLE COMMENTS_MOVIES_USERS ERROR: ", err.message);
            else
                console.log("CREATE TABLE COMMENTS_MOVIES_USERS SUCCESS!");
        });

        response.json("CREATE_BASE FINISHED")
    });
});

module.exports = router;
