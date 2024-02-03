const express = require('express');
const Song = require('../models/Song.js')

const statsRouter = express.Router();

//total stats
statsRouter.get('/total', async (req, res) => {
    try {
        const totalSongs = await Song.countDocuments();
        const totalArtists = await Song.distinct('artist').countDocuments();
        const totalAlbums = await Song.distinct('album').countDocuments();
        const totalGenres = await Song.distinct('genre').countDocuments();

        res.json({
            totalSongs,
            totalArtists,
            totalAlbums,
            totalGenres,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

//stats for each genre
statsRouter.get('/genre', async (req, res) => {
    try {
        const genreStats = await Song.aggregate([
            {
                $group: {
                    _id: '$genre',
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json(genreStats);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

//stats for each artist
statsRouter.get('/artist', async (req, res) => {
    try {
        const artistStats = await Song.aggregate([
            {
                $group: {
                    _id: '$artist',
                    totalSongs: { $sum: 1 },
                    totalAlbums: { $addToSet: '$album' },
                },
            },
            {
                $project: {
                    _id: 0,
                    artist: '$_id',
                    totalSongs: 1,
                    totalAlbums: { $size: '$totalAlbums' },
                },
            },
        ]);

        res.json(artistStats);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Songs in each album
statsRouter.get('/album', async (req, res) => {
    try {
        const albumStats = await Song.aggregate([
            {
                $group: {
                    _id: '$album',
                    songs: { $push: { title: '$title', artist: '$artist' } },
                },
            },
        ]);

        res.json(albumStats);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});


module.exports = statsRouter
