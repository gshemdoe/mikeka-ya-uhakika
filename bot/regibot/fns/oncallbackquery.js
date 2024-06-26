const supatips_Model = require('../database/supatips')
const fametips_Model = require('../database/fametips')
const bin_supatips_Model = require('../database/supatips-bin')

module.exports = (bot, delay) => {
    bot.on('callback_query', async ctx => {
        try {
            let tdd = new Date().toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
            let d = new Date()
            d.setDate(d.getDate() - 1)
            let ydd = d.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })

            let trh = new Date()
            trh.setDate(trh.getDate() + 1)
            let ksh = trh.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })

            let data = ctx.callbackQuery.data
            let mid = ctx.callbackQuery.message.message_id
            if (data.length > 60) {
                await bot.api.sendMessage(imp.shemdoe, 'Warning: Callback data at approve is above the limit')
                    .catch((err) => console.log(err.message))
            }

            if (data.includes('ingia__')) {
                let info = data.split('__')
                let userid = info[1]
                let channel_id = info[2]
                let ch_link = 'https://t.me/+804l_wD7yYgzM2Q0'

                await bot.api.approveChatJoinRequest(channel_id, userid)
                    .catch(async (error) => {
                        if (error.message.includes('ALREADY_PARTICIPANT')) {
                            await ctx.api.deleteMessage(ctx.chat.id, mid).catch(e => console.log(e.message))
                            await ctx.reply(`Ombi lako limekubaliwa, ingia sasa \n${ch_link}`)
                                .catch(ee => console.log(ee.message))
                        }
                    })

                await tempChat.findOneAndDelete({ chatid: Number(userid) })
                console.log('pending deleted')
                await ctx.api.deleteMessage(ctx.chat.id, mid)
                await ctx.reply(`<b>Hi! ${ctx.chat.first_name}</b>\n\nOmbi lako limekubaliwa... Ingia kwenye channel yetu kwa kubonyeza button hapo chini`, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '✅ Ingia Sasa', url: ch_link }]
                        ]
                    }
                })
            } else if (data.includes('post_')) {
                let nano_Arr = await bin_supatips_Model.find()
                for (let bin of nano_Arr) {
                    await supatips_Model.create({
                        matokeo: bin.matokeo,
                        time: bin.time,
                        siku: bin.siku,
                        tip: bin.tip,
                        league: bin.league,
                        nano: bin.nano,
                        status: bin.status,
                        match: bin.match
                    })
                    await bin_supatips_Model.findByIdAndDelete(bin._id)
                }
                await ctx.reply('Mkeka posted successfully', {
                    reply_to_message_id: mid
                })
            } else if (data.includes('updateyd_')) {
                let nano_Arr = await bin_supatips_Model.find()
                await supatips_Model.deleteMany({ siku: ydd })
                for (let bin of nano_Arr) {
                    await supatips_Model.create({
                        matokeo: bin.matokeo,
                        time: bin.time,
                        siku: ydd,
                        tip: bin.tip,
                        league: bin.league,
                        nano: bin.nano,
                        status: bin.status,
                        match: bin.match
                    })
                    await bin_supatips_Model.findByIdAndDelete(bin._id)
                }
                await ctx.reply('Mkeka updated successfully', {
                    reply_to_message_id: mid
                })
            } else if (data.includes('update2d_')) {
                let nano_Arr = await bin_supatips_Model.find()
                for (let bin of nano_Arr) {
                    await supatips_Model.create({
                        matokeo: bin.matokeo,
                        time: bin.time,
                        siku: bin.siku,
                        tip: bin.tip,
                        league: bin.league,
                        nano: bin.nano,
                        status: bin.status,
                        match: bin.match
                    })
                    await bin_supatips_Model.findByIdAndDelete(bin._id)
                }
                await ctx.reply('Mkeka updated successfully', {
                    reply_to_message_id: mid
                })
            } else if (data.includes('updatekesho_')) {
                let nano_Arr = await bin_supatips_Model.find()
                for (let bin of nano_Arr) {
                    await supatips_Model.create({
                        matokeo: bin.matokeo,
                        time: bin.time,
                        siku: ksh,
                        tip: bin.tip,
                        league: bin.league,
                        nano: bin.nano,
                        status: bin.status,
                        match: bin.match
                    })
                    await bin_supatips_Model.findByIdAndDelete(bin._id)
                }
                await ctx.reply('Mkeka updated successfully', {
                    reply_to_message_id: mid
                })
            }

            //fametipis---------------
            else if (data.includes('updfameyestd_')) {
                let nano_Arr = data.split('updfameyestd_')[1].split('+')
                await fametips_Model.deleteMany({ siku: ydd })
                for (let nano of nano_Arr) {
                    let bin = await bin_supatips_Model.findOne({ nano })
                    await fametips_Model.create({
                        matokeo: bin.matokeo,
                        time: bin.time,
                        siku: ydd,
                        tip: bin.tip,
                        league: bin.league,
                        nano: bin.nano,
                        status: bin.status,
                        match: bin.match,
                        UTC3: bin.UTC3
                    })
                    await bin_supatips_Model.findOneAndDelete({ nano })
                }
                await ctx.reply('Mkeka was updated successfully', {
                    reply_to_message_id: mid
                })
            } else if (data.includes('updfametoday_')) {
                let nano_Arr = data.split('updfametoday_')[1].split('+')
                await fametips_Model.deleteMany({ siku: tdd })
                for (let nano of nano_Arr) {
                    let bin = await bin_supatips_Model.findOne({ nano })
                    await fametips_Model.create({
                        matokeo: bin.matokeo,
                        time: bin.time,
                        siku: bin.siku,
                        tip: bin.tip,
                        league: bin.league,
                        nano: bin.nano,
                        status: bin.status,
                        match: bin.match,
                        UTC3: bin.UTC3
                    })
                    await bin_supatips_Model.findOneAndDelete({ nano })
                }
                await ctx.reply('Mkeka updated successfully', {
                    reply_to_message_id: mid
                })
            } else if (data.includes('updfamekesho_')) {
                let nano_Arr = data.split('updfamekesho_')[1].split('+')
                await fametips_Model.deleteMany({ siku: ksh })
                for (let nano of nano_Arr) {
                    let bin = await bin_supatips_Model.findOne({ nano })
                    await fametips_Model.create({
                        matokeo: bin.matokeo,
                        time: bin.time,
                        siku: ksh,
                        tip: bin.tip,
                        league: bin.league,
                        nano: bin.nano,
                        status: bin.status,
                        match: bin.match,
                        UTC3: bin.UTC3
                    })
                    await bin_supatips_Model.findOneAndDelete({ nano })
                }
                await ctx.reply('Mkeka updated successfully', {
                    reply_to_message_id: mid
                })
            }

            else if (data == 'ignore_bin') {
                await bin_supatips_Model.deleteMany()
                await ctx.api.deleteMessage(ctx.chat.id, mid)
                let ign = await ctx.reply('Mkeka Ignored 🤷‍♂️')
                await delay(1500)
                await ctx.api.deleteMessage(ctx.chat.id, ign.message_id)
            }

            switch (data) {
                case 'accept_pload':
                    let pload_link = `https://t.me/+PWiPWm0vB5Y4ZDhk`
                    let org_msg_id = ctx.callbackQuery.message.message_id
                    await ctx.api.deleteMessage(ctx.chat.id, org_msg_id)
                    await ctx.reply(`Hongera 👏 Ombi lako la kujiunga na channel yetu limekubaliwa\n\n🔞 <b>Ingia Sasa\n${pload_link}\n${pload_link}</b>`, { parse_mode: 'HTML' })
                    break;

                case 'jisajili_m': case 'deposit_m':
                    await bot.api.copyMessage(ctx.chat.id, imp.pzone, 7652)
                    break;

                case 'betbuilder':
                    await bot.api.copyMessage(ctx.chat.id, imp.pzone, 7655)
                    break;
            }
        } catch (err) {
            console.log(err.message)
        }
    })
}