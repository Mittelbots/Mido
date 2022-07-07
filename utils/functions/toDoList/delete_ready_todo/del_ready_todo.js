const { toDoState_Deleted } = require("../../../variables/variables");
const { delay } = require("../../delay/delay");
const { getLang } = require("../../getData/getLang");
const { getToDoByProjectId } = require("../../getData/getToDo");
const { updateToDo } = require("../../updateData/updateToDo");

module.exports.del_ready_todo = async (main_interaction) => {
    
    const lang = require(`../../../assets/json/language/${await getLang(main_interaction.guild.id)}.json`);

    const project_id = main_interaction.values;

    const {error, message, data} = await getToDoByProjectId(main_interaction.guild.id, project_id);

    if(error) return main_interaction.channel.send({
        content: '> ❌ '+message
    })
    .then(async msg => {
        await delay(3000);
        msg.delete().catch(err => {})
    })
    .catch(err => {
        main_interaction.message.react('❌')
    })

    for(let i in data) {
        const {error} = await updateToDo({
            guild_id: main_interaction.guild.id,
            todo_id: data[i].id,
            data: {
                column: 'state',
                data: toDoState_Deleted
            }
        })
        
        if(error) return main_interaction.channel.send({
            content: '> ❌ '+ lang.deltodo.errors.failed_to_update + ' ' + lang.errors.try_again_or_contact_support
        }).then(async msg => {
            await delay(3000);
            msg.delete().catch(err => {})
        }).catch(err => {
            main_interaction.message.react('❌').catch(err => {})
        })
    }

    return await main_interaction.channel.send({
        content: '> ✅ ' + lang.deltodo.success.success_deleted
    }).then(async msg => {
        await delay(3000);
        msg.delete().catch(err => {})
    }).catch(err => {
        main_interaction.message.react('✅').catch(err => {})
    })
}