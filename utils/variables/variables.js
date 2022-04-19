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

function increase(array, user_id) {
    let passed = false;
    for(let i in array) {
        if(array[i].user_id === user_id) {
            array[i].count = array[i].count + 1;
            passed = true;
            return array[i].count;
        }
    }

    if(!passed) {
        const obj = {
            user_id: user_id,
            count: 1
        }
        array.push(obj);
        return obj.count;
    }
}

function decrease(array, user_id) {
    let passed = false;
    for(let i in array) {
        if(array[i].user_id === user_id) {
            array[i].count = 0;
            return passed = true;
        }
    }

    if(!passed) {
        const obj = {
            user_id: user_id,
            count: 0
        }
        array.push(obj);
    }
}


function getCurrentCount(array, user_id) {
    let passed = false;
    let result;
    for(let i in array) {
        if(array[i].user_id === user_id) {
            result = array[i];
            passed = true;
            return result.count;
        }
    }

    if(!passed) {
        const obj = {
            user_id: user_id,
            count: 0
        }
        array.push(obj);
        return obj.count
    }
}

//? TO-DO INTERACTION COUNT
let toDoInteractionCount = [];

module.exports.increase_toDoInteractionCount = (user_id) => {
    return increase(toDoInteractionCount, user_id);
}

module.exports.decrease_toDoInteractionCount = (user_id) => {
    return decrease(toDoInteractionCount, user_id);
}

module.exports.getCurrentInteractionCount = (user_id) => {
    return getCurrentCount(toDoInteractionCount, user_id);
}

//==========================================================

//? TO-DO ADD COUNT
let toDoAddCount = [];

module.exports.increase_toDoAddCount = (user_id) => {
    return increase(toDoAddCount, user_id);
}

module.exports.decrease_toDoAddCount = (user_id) => {
    return decrease(toDoAddCount, user_id);
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