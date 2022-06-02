const { errorhandler } = require('../../utils/functions/errorhandler/errorhandler');
const dbconfig = require('../../_secret/db/db.json');
const exec = require('child_process').exec;


module.exports.db_backup = () => {
  exec(` mysqldump -u ${dbconfig.backup.user} --password='${dbconfig.backup.password}' ${dbconfig.connection.database} --no-tablespaces > mido-db-backup/${new Date().getDay()+'_'+new Date().getMonth()+'_'+new Date().getFullYear()}.backup.sql`, (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
        console.log(`Mysql exec error: ${error}`);
        errorhandler({err: err + ' ' + stderr, fatal: true});
    }
  });
  exec(` cd ${dbconfig.backup.backup_repo} && git pull && git add . && git commit -m "${dbconfig.backup.backup_repo}" && git push`, (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
        console.log(`Git exec error: ${error}`);
        errorhandler({err: err + ' ' + stderr, fatal: true});
    }
  });
  
  console.info(`Database backuped successfully`);
  return true;
}