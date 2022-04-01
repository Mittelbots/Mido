module.exports.add_ProjectId = 'add_project';
module.exports.select_ProjectId = 'select_project';
module.exports.delete_Project = 'delete_project';
module.exports.cancel_delete_project = 'cancel_delete_project';


//? TODO STATES
module.exports.toDoState_Active = 1;
module.exports.toDoState_Inactive = 0;
module.exports.toDoState_Deleted = 2;
module.exports.toDoState_Ready = 3;

//? SITE COUNT
let currentSiteCountLocal = 0;
module.exports.increase_currentSiteCount = () => {
    return currentSiteCountLocal = currentSiteCountLocal + 10;
}
module.exports.decrease_currentSiteCount = () => {
    currentSiteCountLocal = currentSiteCountLocal - 10;
    if(currentSiteCountLocal < 0) currentSiteCountLocal = 0;
    return currentSiteCountLocal;
}

module.exports.getCurrentSiteCount = () => {
    return currentSiteCountLocal;
}