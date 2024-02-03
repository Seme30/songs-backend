const express = require('express');
const Song = require('../models/Song.js')


const songRouter = express.Router()

//get
songRouter.get('/', async (req, res) => {
    try{
        const songs = await Song.find({})
         console.log("GET")
        return res.status(200).send({
            count: songs.length,
            data: songs
        })
    }catch(error){
        console.log(error.message);
        return res.status(500).send({message: error.message})
    }
})

//get by id
songRouter.get('/:id', async (req, res) => {
    try{
        const {id} = req.params
        const song = await Song.findById(id)

        return res.status(200).json(song)
    }catch(error){
        console.log(error.message);
        return res.status(500).send({message: error.message})
    }
})

//create
songRouter.post('/', async (req, res) => {
    try{
        // console.log(req.body)

        if(!req.body.title || !req.body.artist){
            return res.status(400).send({
                message: "Send all required fields: title, artist"
            })
        } 

        const newSong = {
            title: req.body.title,
            artist: req.body.artist,
            album: req.body.album,
            genre: req.body.genre
        }

        const song = await Song.create(newSong);

        return res.status(201).send(song);

    }catch(error){
        console.log(error.message)
        res.status(500).send({ message: error.message})
    }
})

//update
songRouter.put('/:id', async (req, res) => {
    try{
        // console.log(req.body)

        if(!req.body.title || !req.body.artist){
            return res.status(400).send({
                message: "Send all required fields: title, artist !."
            })
        } 

        const {id} = req.params;

        const newSong = {
            title: req.body.title,
            artist: req.body.artist,
            album: req.body.album,
            genre: req.body.genre
        }

        const updatedSong = await Song.findByIdAndUpdate(id, newSong);

        if(!updatedSong){
            res.status(404).send({message: "Song Not Found!."})
        }

        return res.status(200).send({message: "Song Updated Successfully!."});

    }catch(error){
        console.log(error.message)
        res.status(500).send({ message: error.message})
    }
})

//delete
songRouter.delete('/:id', async (req, res) => {
    try{
     
        const {id} = req.params;

        const result = await Song.findByIdAndDelete(id);

        if(!result){
            res.status(404).send({message: "Song Not Found!."})
        }

        return res.status(200).send({message: "Song Deleted Successfully!."});

    }catch(error){
        console.log(error.message)
        res.status(500).send({ message: error.message})
    }
})


module.exports = songRouter