const dbconfig = require('../../_secret/db/db.json');
const exec = require('child_process').exec;


module.exports.db_backup = () => {
  exec(` mysqldump -u ${dbconfig.connection.user} -p${dbconfig.connection.password} ${dbconfig.connection.database} > mido-db-backup/${new Date().getDay()+'_'+new Date().getMonth()+'_'+new Date().getFullYear()}.backup.sql`);
  exec(` cd mido-db-backup && git add . && git commit -m "mido-db-backup" && git push`);
  
  console.info(`Database backuped successfully`);
  return true;
}