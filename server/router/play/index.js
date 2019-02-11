const express = require('express');
const router = express.Router();
const mydb = require('../../db/db');
const sql = require('../../db/requetes');
const passport = require('../../tools/passport');
const yifysubtitles = require('yifysubtitles');//
var fs = require('fs');//
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;//
const ffmpeg = require('fluent-ffmpeg');//
ffmpeg.setFfmpegPath(ffmpegPath);//
var torrentStream = require('torrent-stream');//

var engine;
var command = {};
var movie_path;

// ********************************************************************** //
// TOOLS
// ********************************************************************** //

function ft_json(id)
{
  if (!command[id])
    command[id] = {};
}

function ft_url_mkdir(url)
{
  var tab_url = url.split('/');
  var str_url = '';
  var i = 0;
  while (i < tab_url.length)
  {
    str_url += tab_url[i];
    if (tab_url[i] != '.' && tab_url[i] != ".." && !(fs.existsSync(str_url)))
      fs.mkdirSync(str_url);
    str_url += '/';
    i++;
  }
}

function ft_objlen(obj)
{
  let len = 0;
  for (i in obj)
  {
    len++;
  }
  return (len);
}

function ft_sigall(id, qualite)
{
  if (command)
  {
    console.log('obj len: ', ft_objlen(command));
    for (i in command)
    {
      for (j in command[i])
      {
        console.log("sigall: " + "id: " + i + " qualite: " + j);
        if (i == id && j == qualite)
          command[i][j].kill('SIGCONT');
        else
          command[i][j].kill('SIGSTOP');
      }
    }
  }
  else
    console.log('no obj sigall');
}

function ft_magnet(url)
{
  var is_magnet = url.indexOf('magnet');
  if (is_magnet == -1)
  {
    var hash_url = url.split('/');
    var hash = hash_url[hash_url.length - 1];
    var magnet = 'magnet:?xt=urn:btih:' + hash;
    return (magnet);
  }
  return (url);
}

// ********************************************************************** //
// SUBTITLE
// ********************************************************************** //

function ft_one_subtitle(movie_id, subtitle_path, lang)
{
  yifysubtitles(movie_id, {path: subtitle_path, langs: lang}).then(res =>
    {
      if (res.length != 0 && res[0].path != '')
      {
        var tmp_path = res[0].path.split("../client/build").join("");
        let data = [movie_id, res[0].lang, tmp_path];
        mydb.connection_db.query(sql.add_movie_subtitle, [[data]], function(err2, rows)
        {
          if (err2) {console.log(err2)}
        });
      }
    })
    .catch(err => {});
}

function ft_subtitle(id)
{
  var subtitle_path = '../client/build/tmp/subtitles/' + id;
  ft_url_mkdir(subtitle_path);

  mydb.connection_db.query(sql.get_movie_subtitle, [[id]], function(err, rows)
  {
    if (err) {console.log(err); return;}
    console.log('get subtitle rows length :', rows.length);
    if (rows.length == 0)
    {
      console.log('download subtitle ----------------------- ');
      var tab_lang = ['sq','ar','bn','pb','bg','zh','hr','cs','da','nl','en','et','fa','fi','fr','de','el','he','hu','id','it','ja','ko','lt','mk','ms','no','pl','pt','ro','ru','sr','sl','es','sv','th','tr','ur','uk','vi'];
      let i = 0;
      while (i < tab_lang.length)
      {
        ft_one_subtitle(id, subtitle_path, [tab_lang[i]]);
        i++;
      }
    }
  });
};

// ********************************************************************** //
// SLICING
// ********************************************************************** //

function ft_slicing (path_in, path_out, id, qualite)
{
  console.log('slicing parame: ', path_in, path_out);
  command[id][qualite] = ffmpeg(path_in, {timeout: 432000})
  .addOptions([
    '-f hls',
    '-deadline realtime',
    // '-preset ultrafast', // ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow, placebo
    '-start_number 0',// start the first .ts segment at index 0
    '-hls_time 10',// 10 second segment duration
    '-hls_list_size 0',
  ])
  .output(path_out)
  .on('progress', function(progress)
  {
	console.log('progress', path_in);
  })
  .on('error', (e) =>
  {
	console.log("Conversion fail!");
  })
  .on('end', () => 
  {
	console.log("slicing completed:\n" + path_in + "\n\n");
  });
}

// ********************************************************************** //
// ENGINE
// ********************************************************************** //

function ft_engine (id, qualite)
{
  let status = 0;
  ft_json(id);

  engine.on('ready', function()
  {
    console.log('engine ready ---------------');
    ft_sigall(id, qualite);
    engine.files.forEach(function(file)
    {
      var tmp_tab = file.name.split('.');
      var format = tmp_tab[tmp_tab.length - 1];
      if (format == 'mp4' || format == 'mkv' || format == 'avi')
      {
        movie_path = './tmp/' + id + '/' + qualite + '/' + file.path;
        console.log('movie_path: ', movie_path);
        file.createReadStream({start: 0, end: 15});
        file.createReadStream({start: 16});
      }
    });
  });

  engine.on('download', (pieceindex) =>
  {
    console.log('download', movie_path);
    if (pieceindex < 14)
    {
      status++;
      console.log('status:', status);
      if (status == 14)
      {
        fs.access(movie_path, (err) =>
        {
          if (err == null)
          {
            console.log('slicing -------------------');
            var out = './tmp/' + id + '/' + qualite + '/out.m3u8';
            ft_slicing(movie_path, out, id, qualite);
            command[id][qualite].run();
          }
        });
      }
    }
  });

  engine.on('idle', () =>
  {
    console.log('downloaded completed', movie_path);
  });
}

// ********************************************************************** //
// GET need response
// ********************************************************************** //

router.get('/:id/:qualite', passport.authenticate('jwt', {session: false}), (req, res) =>
{
  var id = req.params.id;
  var qualite = req.params.qualite;
  console.log('get id:' + id + ', qualite:' + qualite);
  mydb.connection_db.query(sql.get_movie_torrent, [id, qualite], function(err, rows)
  {
    if (err) {console.log(err); res.send("NO"); return;}
    ft_subtitle(id);
    var magnet = ft_magnet(rows[0].url);

    const options =
    {
      connections: 20,
      uploads: 10,
      tmp: './tmp/',
      path: './tmp/' + id + '/' + qualite,
      verif: true,
      dht: true,
      tracker: true
    }

    engine = torrentStream(magnet, options);
    ft_engine(id, qualite);
    mydb.connection_db.query(sql.get_movie_file, [id, qualite], function(err1, rows1) {
      if (err1) {
        console.log(err1);
      } else if (rows1.length) {
        mydb.connection_db.query(sql.update_movie_file_date, [id, qualite], function(err2, rows2) {
          if (err2) {
            console.log(err2);
          }
        })
      } else {
        mydb.connection_db.query(sql.add_movie_file, [[id, qualite, options.path]], function(err3, rows3) {
          if (err3) console.log(err3);
        })
      }
    })
    res.send("OK");
  });
});

// ********************************************************************** //
// POST need response
// ********************************************************************** //

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) =>
{
  var id = req.body.id;
  var qualite = req.body.qualite;
  console.log(req.body.action);
  console.log("post id:" + id + " qualite:" + qualite);

  if (req.body.action === 'get_movie')
  {
    // console.log(id, qualite);
    // console.log(req.body.qualite);
    if (fs.existsSync(__dirname + '/../../tmp/' + id + '/' + qualite + '/out.m3u8')) 
    {
      res.send('./tmp/' + id + '/' + qualite + '/out.m3u8');
      console.log('ok************************************************');
    }
    else
    {
      res.send("NO");
      // console.log('not found');
    }
  }

  if (req.body.action === 'get_subtitle')
  {
    mydb.connection_db.query(sql.get_movie_subtitle, [[req.body.id]], function(err, rows)
    {
      if (err)
      {
        console.log(err);
        res.send('NO');
        return ;
      }
      console.log('subtitle in db: ', rows.length);
      res.send(rows);
    });
  }

  if (req.body.action === 'sigall')
  {
    ft_sigall('all', 'all');
    res.send('OK');
  }
});

module.exports = router;
