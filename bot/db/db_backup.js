const { errorhandler } = require('../../utils/functions/errorhandler/errorhandler');
const exec = require('child_process').exec;


module.exports.db_backup = () => {
  exec(` mysqldump -u ${process.env.DB_USE} --password='${process.env.DB_PASS}' ${process.env.DB_NAME} --no-tablespaces > mido-db-backup/${new Date().getDay()+'_'+new Date().getMonth()+'_'+new Date().getFullYear()}.backup.sql`, (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
        console.log(`Mysql exec error: ${error}`);
        errorhandler({err: err + ' ' + stderr, fatal: true});
    }
  });
  exec(` cd ${process.env.BACKUP_PATH} && git pull && git add . && git commit -m "${process.env.BACKUP_PATH}" && git push`, (error, stdout, stderr) => {
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