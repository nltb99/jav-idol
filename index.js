#!/usr/bin/env node

 //        _ _   _
 //  _ __ | | |_| |__   __ _  ___
 // | '_ \| | __| '_ \ / _` |/ _ \
 // | | | | | |_| |_) | (_| | (_) |
 // |_| |_|_|\__|_.__/ \__,_|\___/
// 
// Pet Project by Nguyen Le Tien Bao ><
// Inspired by PHAM HUY HOANG(toidicodedao)

const commander = require('commander')
const axios = require('axios')
const prompts = require('prompts')
const program = new commander.Command()
program.version('0.0.1')
const chalk = require('chalk');

const searchingName = [
  {
    type: 'text',
    name: 'name',
    message: 'Search For Jav Actress Name: ',
    validate: value => value.match(/[0-9]/g) ? `Actress name is not valid` : true
  },
];
const searchingSpecificID = [
  {
    type: 'text',
    name: 'id',
    initial: 0,
    style: 'default',
    message: 'Search For ID JAV: ',
    validate: value => value.match(/[a-zA-Z]/g) ? `Actress ID is not valid` : true
  },
];

function dis(name,len){ // distance space bettween
    let n = len - name.toString().length
    return " ".repeat(n)
}

// Serve for search
program
    .command('search')
    .description('Search For Jav Actress')
    .action(async function() {
        let checkFoundJavActress=true // Check if count of responses greater than 0
        const promptsName = await prompts(searchingName);
        const jav_name = await promptsName.name
        actress_url = `https://jav-rest-api-htpvmrzjet.now.sh/api/actress?name=${jav_name}`
        await axios.get(actress_url).then((res) => {
            let dataResponse = res.data.result
            let count = dataResponse.length
            if (count==0){
                console.log(chalk.yellowBright.bold('@None Of Jav Actress Is Found!!!'))
                checkFoundJavActress=false
                return
            }

            console.log(`  ${chalk.cyanBright.bold('#')}  | ${chalk.cyanBright.bold('ID')}${" ".repeat(7)}| ${chalk.cyanBright.bold('Actress Name')}${" ".repeat(6)}| ${chalk.cyanBright.bold('Japanese Name')}${" ".repeat(10)}`)
            console.log('=======================================================')

            for (let i = 1; i < count; i++) {
                let id_actress = dataResponse[i].id,
                name_actress = dataResponse[i].name,
                japanese_name_actress = dataResponse[i].japanName
                console.log(`  ${chalk.blueBright.bold(i)}${dis(i,3)}| ${chalk.magentaBright.bold(id_actress)}${dis(id_actress,9)}| ${chalk.yellowBright.bold(name_actress)}${dis(name_actress,18)}| ${chalk.whiteBright.bold(japanese_name_actress)}`)
            }
        })
        if(checkFoundJavActress){
            const promptsId = await prompts(searchingSpecificID)
            const jav_id = await promptsId.id
            video_url = `https://jav-rest-api-htpvmrzjet.now.sh/api/videos/${jav_id}`
            await axios.get(video_url).then(res =>{
                let dataResponse = res.data.result
                let count = dataResponse.length
                if (count==0){
                    console.log(chalk.yellowBright.bold('@None of video is found!!!'))
                    return
                }

                console.log(`  #  | Date${" ".repeat(7)}| Code${" ".repeat(9)}| Title`)
                console.log('========================================================================')

                for (let i = 1; i < count; i++) {
                    let title_video = dataResponse[i].name
                    let date_video = new Date(dataResponse[i].date)
                    let date_formatted=`${date_video.getMonth()+1}-${date_video.getDate()}-${date_video.getFullYear()}`
                    let code_video = dataResponse[i].siteUrl.match(/cid=[\w]+/g)[0].slice(4,)
                    console.log(`  ${chalk.blueBright.bold(i)}${dis(i,3)}| ${chalk.greenBright.bold(date_formatted)}${dis(date_formatted,11)}| ${chalk.redBright.bold(code_video)}${dis(code_video,17)}| ${chalk.whiteBright.bold(title_video)}`)
                }
                console.log(chalk.blue.bold("Enjoy :>!!"))
            })
        }
    })

//Serve for help 
program.on('--help', () => {
  console.log('');
  console.log('Example call:');
  console.log('$ jav-idol search');
});

program.parse(process.argv)
