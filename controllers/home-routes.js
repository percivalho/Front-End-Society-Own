const router = require('express').Router();
const { User, Playlist, Comment, Artist, Song, PlaylistSong } = require('../models');
const withAuth = require('../utils/auth');
const { Op } = require('sequelize');

// GET all public playlist for homepage
router.get('/', async (req, res) => {
  try {
    const dbPlaylistData = await Playlist.findAll({
      where: {
        public: 1
      },      
      /*include: [
        {
          model: Song,
          through: PlaylistSong,
          as: 'songs',
          include: [
            {
              model: Artist,
              as: 'artist',
            },
          ],
        },
      ],*/
      order: [['createdAt', 'DESC']],      
    });

    const playlists = dbPlaylistData.map((playlist) =>
      playlist.get({ plain: true })
    );
    //console.log(playlists);
    //console.log(playlists[0].songs);
    //console.log(req.session);
    res.render('homepage', {
      playlists,
      loggedIn: req.session.loggedIn,
      username: req.session.username,
      sound: req.session.sound,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one blog only, and by id
router.get('/playlist/:id', withAuth, async (req, res) => {
  // If the user is logged in, allow them to view the blog
  try {
    const dbPlaylistData = await Playlist.findByPk(req.params.id, {
      include: [
        /*{
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ],
        },*/
        {
          model: Song,
          through: PlaylistSong,
          as: 'songs',
        },
      ],
    });
    if (dbPlaylistData){
      const playlist = dbPlaylistData.get({ plain: true });
      console.log(playlist);
      res.render('playlist', { playlist, loggedIn: req.session.loggedIn });
    } else {
      res.status(404).json({ message: 'No Playlist found with that id!' });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});





// Post Comment on a blog post
router.post('/api/playlist/:id', withAuth, async (req, res) => {

  try {
    // retrieve the user.id from username
    const dbUserData = await User.findOne({
      where: {
        username: req.session.username,
      },
    });

    if (dbUserData.id) {
      try {
        const dbCommentData = await Comment.create({
          blog_id: req.params.id,
          description: req.body.comment,
          user_id: dbUserData.id
        });
        req.session.save(() => {
          req.session.loggedIn = true;
          req.session.username = req.session.username;
    
          res.status(200).json(dbCommentData);
        });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// myPlaylist
router.get('/myPlaylist', withAuth, async (req, res) => {
  try {
    // find  the user.id from username
    const dbUserData = await User.findOne({
      where: {
        username: req.session.username,
      },
    });
    
    if (dbUserData.id) {
      try {
        const dbPlaylistData = await Playlist.findOne({
          where: {
            user_id: dbUserData.id,
          },
          include: [
            {
              model: Song,
              through: PlaylistSong,
              as: 'songs',
              include: [
                {
                  model: Artist,
                  as: 'artist'
                }
              ]
            },
          ]
        });
    
        if (dbPlaylistData){
          const playlist = dbPlaylistData.get({ plain: true });
          //console.log("========20230714========")
          //console.log(playlist);
          //console.log(playlist.songs);
          res.render('myPlaylist', { playlist, loggedIn: req.session.loggedIn });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// myPlaylist Search
router.get('/myResult/search', withAuth, async (req, res) => {
  try {
    console.log(req.query);
    let searchTerm = req.query.query;


    const dbSongData = await Song.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.like]: `%${searchTerm}%` } },
                { '$Artist.name$': { [Op.like]: `%${searchTerm}%` } }
            ]
        },
        include: [{
            model: Artist
        }]
    }); 

    console.log(dbSongData);     
    let songs ={};
    if (dbSongData){
      songs = dbSongData.map((song) =>
        song.get({ plain: true })
      );
    }
    console.log(songs);
    //res.render('myResult', { songs, loggedIn: req.session.loggedIn });
    res.json({ songs, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

// Add a song into playlist
router.post('/myPlaylist/addSong/:id', withAuth, async (req, res) => {
  try {
    const id = req.params.id;
    await console.log(id);
    // retrieve the user.id from username
    console.log(req.session.username);
    const dbUserData = await User.findOne({
      where: {
        username: req.session.username,
      },
    });

    if (dbUserData.id) {
      const dbPlaylistData = await Playlist.findOne({
        where: {
          user_id: dbUserData.id,
        },
      });      
      
      try {
        const dbPlaylistSongData = await PlaylistSong.create({
          playlist_id: dbPlaylistData.id,
          song_id: id,
        });
        req.session.save(() => {
          req.session.loggedIn = true;
          req.session.username = req.session.username;    
          res.status(200).json(dbPlaylistData);
          //res.render('myPlaylist', { playlists, loggedIn: req.session.loggedIn });

        });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


// Delete song from playlist
router.delete('/myPlaylist/:id', withAuth, async (req, res) => {
  try {
    const id = req.params.id;
    await console.log(id);
    // retrieve the user.id from username
    console.log(req.session.username);
    const dbUserData = await User.findOne({
      where: {
        username: req.session.username,
      },
    });

    if (dbUserData.id) {
      const dbPlaylistData = await Playlist.findOne({
        where: {
          user_id: dbUserData.id,
        },
      });      
      
      try {  
        const dbPlaylistSongData = await PlaylistSong.destroy({
          where: {
            playlist_id: dbPlaylistData.id,
            song_id: id,
          },
        });
        if (!dbPlaylistSongData) {
          res.status(404).json({ message: 'No Song deleted from playlist!' });
          return;
        }
        res.status(200).json(dbPlaylistSongData);
      } catch (err) {
        res.status(500).json(err);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});






// Login 
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

// Signup
router.get('/signup', (req, res) => {
  res.render('signup');
});


module.exports = router;
