const dbconfig = require('../../_secret/db/db.json');
const exec = require('child_process').exec;


module.exports.db_backup = () => {
  exec(` mysqldump -u ${dbconfig.connection.user} -p${dbconfig.connection.password} ${dbconfig.connection.database} > mido-db-backup/${new Date().getDay()+'_'+new Date().getMonth()+'_'+new Date().getFullYear()}.backup.sql`, (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
        console.log(`Mysql exec error: ${error}`);
    }
  });
  exec(` cd mido-db-backup && git add . && git commit -m "mido-db-backup" && git push`, (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
        console.log(`Git exec error: ${error}`);
    }
  });
  
  console.info(`Database backuped successfully`);
  return true;
}