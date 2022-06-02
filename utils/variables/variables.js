module.exports.add_ProjectId = 'add_project';
module.exports.select_ProjectId = 'select_project';
module.exports.delete_Project = 'delete_project';
module.exports.cancel_delete_project = 'cancel_delete_project';
module.exports.personal_projectId = 'personal_project';

//==========================================================
//? TODO STATES
module.exports.toDoState_Active = 1;
module.exports.toDoState_Inactive = 0;
module.exports.toDoState_Deleted = 2;
module.exports.toDoState_Ready = 3;


//==========================================================

function increase(array, user_id, count) {
    let passed = false;
    for(let i in array) {
        if(array[i].user_id === user_id) {
            array[i].count = array[i].count + count;
            passed = true;
            return array[i].count;
        }
    }

    if(!passed) {
        const obj = {
            user_id: user_id,
            count: count
        }
        array.push(obj);
        return obj.count;
    }
}

function decrease(array, user_id, isSiteCount, siteCount) {

    let passed = false;
    for(let i in array) {
        if(array[i].user_id === user_id) {
            if(isSiteCount) {
                array[i].count = array[i].count - siteCount;
            }else {
                array[i].count = 0;
            }
            passed = true;
            return array[i].count;
        }
    }

    if(!passed) {
        const obj = {
            user_id: user_id,
            count: 0
        }
        array.push(obj);
        return obj.count;
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

//==========================================================


//? SITE COUNT
let currentSiteCountLocal = [];

module.exports.increase_currentSiteCount = (user_id) => {
    return increase(currentSiteCountLocal, user_id, 10);
}
module.exports.decrease_currentSiteCount = (user_id) => {
    return decrease(currentSiteCountLocal, user_id, true, 10);
}

module.exports.getCurrentSiteCount = (user_id) => {
    return getCurrentCount(currentSiteCountLocal, user_id);
}

//==========================================================

//? TO-DO INTERACTION COUNT
let toDoInteractionCount = [];

module.exports.increase_toDoInteractionCount = (user_id) => {
    return increase(toDoInteractionCount, user_id, 1);
}

module.exports.decrease_toDoInteractionCount = (user_id) => {
    return decrease(toDoInteractionCount, user_id, false, null);
}

module.exports.getCurrentInteractionCount = (user_id) => {
    return getCurrentCount(toDoInteractionCount, user_id);
}

//==========================================================

//? TO-DO ADD COUNT
let toDoAddCount = [];

module.exports.increase_toDoAddCount = (user_id) => {
    return increase(toDoAddCount, user_id, 1);
}

module.exports.decrease_toDoAddCount = (user_id) => {
    return decrease(toDoAddCount, user_id, false, null);
}

//==========================================================

//? CURRENT PROJECT ID
let currentProjectId = [];

module.exports.changeCurrentProjectId = (projectId, user_id) => {

    let passed = false;
    for(let i in currentProjectId) {
        if(currentProjectId[i].user_id === user_id) {
            currentProjectId[i].projectId = projectId;
            passed = true;
        }
    }

    if(!passed) {
        const obj = {
            projectId: projectId,
            user_id: user_id
        }
        currentProjectId.push(obj);
    }
    return;
}

module.exports.getCurrentProjectId = (user_id) => {
    let passed = false;
    for(let i in currentProjectId) {
        if(currentProjectId[i].user_id === user_id) {
            passed = true;
            return currentProjectId[i].projectId;
        }
    }

    if(!passed) return false;
}