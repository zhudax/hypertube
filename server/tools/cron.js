var cron = require('node-cron');
const fs = require('fs');
const db = require('../db/db').connection_db;
const sql = require('../db/requetes');

function deleteAll(path) {
    var files = [];
    if(fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function(file, index) {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteAll(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
        db.query(sql.delete_movie_file, [path], (err, rows) => {
            if (err) console.log(err);
        })
    }
}

// Verifier tous les jours a minuit
// s (optional) m h d m dayOfWeek
module.exports = () => cron.schedule('0 0 * * *', () => {
	db.query(sql.get_movie_file_by_time, (err, rows) => {
		if (err) {
			console.log("Error get movie file");
		} else if (rows.length > 0) {
			for (let i = 0; i < rows.length; i++) {
                deleteAll(rows[i].path);
            }
        }
    })
});