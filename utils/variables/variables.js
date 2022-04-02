module.exports.add_ProjectId = 'add_project';
module.exports.select_ProjectId = 'select_project';
module.exports.delete_Project = 'delete_project';
module.exports.cancel_delete_project = 'cancel_delete_project';

//==========================================================
//? TODO STATES
module.exports.toDoState_Active = 1;
module.exports.toDoState_Inactive = 0;
module.exports.toDoState_Deleted = 2;
module.exports.toDoState_Ready = 3;

//==========================================================
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

//==========================================================
//? TO-DO LIST COUNT
let todoListInteractionCount = 0;

module.exports.increase_todoListInteractionCount = () => {
    return todoListInteractionCount = todoListInteractionCount + 1;
}

module.exports.decrease_todoListInteractionCount = () => {
    return todoListInteractionCount = 0;
}


//==========================================================

//? TO-DO INTERACTION COUNT
let toDoInteractionCount = 0;

module.exports.increase_toDoInteractionCount = () => {
    if(toDoInteractionCount < 1) toDoInteractionCount = 0;

    return toDoInteractionCount = toDoInteractionCount + 1;
}

module.exports.decrease_toDoInteractionCount = () => {
    return toDoInteractionCount = 0;
}

module.exports.getCurrentInteractionCount = () => {
    return toDoInteractionCount;
}

//==========================================================

//? TO-DO ADD COUNT
let toDoAddCount = 0;

module.exports.increase_toDoAddCount = () => {
    if(toDoAddCount < 1) toDoAddCount = 0;
    
    return toDoAddCount = toDoAddCount + 1;
}

module.exports.decrease_toDoAddCount = () => {
    return toDoAddCount = 0;
}

//==========================================================

//? CURRENT PROJECT ID
let currentProjectId;

module.exports.changeCurrentProjectId = (projectId) => {
    currentProjectId = projectId;
}

module.exports.getCurrentProjectId = () => {
    return currentProjectId;
}