const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: '.data.deployeddatabase.sqlite',
});
const Seiyuu = sequelize.import('../..//models/Seiyuu');
const helper = require('../../helpers.js');

module.exports = {
    name: 'fillseiyuudb',
    description: 'Fills the seiyuu DB with the data from the JSON.',
    adminOnly: true,
    permissions: 'ADMINISTRATOR',
    execute(message, args) {
        const fs = require('fs');
        let rawdata
        let obj

        helper.data.readSpreadsheet("1mFTCIxa-FlRAWT70M7lC82bx-HRvDm_lovUJLL4FlN8", "seiyuu", "SeiyuuInfo!A:Z")
        rawdata = fs.readFileSync('./seiyuu.json');
        obj = JSON.parse(rawdata) 
        
        let arr = []
        
        for (let ID in obj['objects'])
        {   
                arr.push(obj['objects'][ID])
        }

        let seiyuu_id = 0;
        addSeiyuuToDB(seiyuu_id)

        async function addSeiyuuToDB(id)
        {
            try {
                seiyuu_id = id
                let seiyuu = Seiyuu.findOrCreate({
                    where: {
                        id: seiyuu_id+1
                    },
                    defaults: {
                        franchise: arr[seiyuu_id]["Franchise"],
                        image_color: arr[seiyuu_id]["Image Color"],
                        seiyuu_name: arr[seiyuu_id]["Seiyuu Name"],
                        nickname: arr[seiyuu_id]["Nickname"],
                        nick_query: arr[seiyuu_id]["Nick Query"],
                        artist_name: arr[seiyuu_id]["Artist Name"],
                        character: arr[seiyuu_id]["Character"],
                        character_image: arr[seiyuu_id]["Character Image"],
                        birthday: arr[seiyuu_id]["Birthday"],
                        birthplace: arr[seiyuu_id]["Birthplace"],
                        twitter_account: arr[seiyuu_id]["Twitter Account"],
                        other_media: arr[seiyuu_id]["Other Media"],
                        other_media_url: arr[seiyuu_id]["Other Media URL"],
                        blog: arr[seiyuu_id]["Blog"],
                        blog_url: arr[seiyuu_id]["Blog URL"],
                        website: arr[seiyuu_id]["Website"],
                        website_url: arr[seiyuu_id]["Website URL"],
                        agency: arr[seiyuu_id]["Agency"],
                        agency_url: arr[seiyuu_id]["Agency URL"],
                        mal_image: arr[seiyuu_id]["MAL Image"],
                        other_image: arr[seiyuu_id]["Other Image"],
                        mal_page: arr[seiyuu_id]["MAL Page"],
                        skills: arr[seiyuu_id]["Skills"],
                        hobbies: arr[seiyuu_id]["Hobbies"],
                        fun_facts: arr[seiyuu_id]["Fun Facts"],


                    }
                }).then(function(result) {
                    let created = result[1]
                    seiyuu_id++
                    addSeiyuuToDB(seiyuu_id)

                    if(!created)
                        console.log("Seiyuu is already in the DB")

            })
            }
            catch (e) {
                if (e.name === 'SequelizeUniqueConstraintError') {
                    return message.reply('That Seiyuu is already added to the DB.');
                }
                console.log(e)
                return message.reply('Something went wrong with adding a tag.');
            }
        }

       },
};