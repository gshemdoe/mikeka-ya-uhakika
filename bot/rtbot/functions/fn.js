const rtStarterModel = require('../database/chats')
const binModel = require('../database/rtbin')
const axios = require('axios').default

const createUser = async (ctx, delay) => {
    try {
        let chatid = ctx.chat.id
        let username = ctx.chat.first_name
        let handle = 'unknown'
        let refferer = ctx.botInfo.username

        if (ctx.chat.username) {
            handle = ctx.chat.username
        }

        let user = await rtStarterModel.findOne({ chatid })

        if (!user) {
            await ctx.reply(`Habari! ${username}\n\nHongera umepokea points 1000 bure zitakazokuwezesha kupata videos na movies zetu. \nKila video/movie itakugharimu points 250`)
            await rtStarterModel.create({
                chatid, username, handle, refferer, paid: false, points: 1000, movie: 0, shows: 0
            })
            await delay(2000)
        } else if (user && user.refferer != refferer) {
            await user.updateOne({ $set: { refferer: refferer } })
        }
    } catch (error) {
        console.log(error.message)
    }
}

const sendPaidVideo = async (ctx, delay, bot, imp, vid, userid, OS) => {
    //upload video
    let type = OS
    let botname = ctx.botInfo.username
    await ctx.sendChatAction('upload_video')
    let dvid = await bot.telegram.copyMessage(userid, imp.ohmyDB, vid.msgId, {
        reply_markup: {
            keyboard: [
                [
                    { text: "➕ Ongeza Points" },
                    { text: "⛑ Help / Msaada ⛑" }
                ]
            ],
            is_persistent: true,
            resize_keyboard: true
        }
    })

    //check if video sent in past 4hrs
    //if not add to duplicate and deduct 250 points
    let dup_checker = await binModel.findOne({ chatid: Number(userid), nano: vid.nano })
    if (!dup_checker) {
        await ctx.sendChatAction('typing')
        await binModel.create({ chatid: Number(userid), nano: vid.nano })

        let rcvr = await rtStarterModel.findOneAndUpdate({ chatid: userid }, { $inc: { points: -250 } }, { new: true })

        let txt = `Umepokea Full Video kwa gharama ya points 250. Umebakiwa na Points ${rcvr.points}.`
        if (type == 'movie') {
            txt = `Umepokea Movie kwa gharama ya points 250. Umebakiwa na Points ${rcvr.points}.`
            await rtStarterModel.findOneAndUpdate({ chatid: userid }, { $inc: { movie: 1 } })
        } else {
            await rtStarterModel.findOneAndUpdate({ chatid: userid }, { $inc: { shows: 1 } })
        }
        let data = {
            chat_id: ctx.chat.id,
            text: txt,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "💰 Salio", callback_data: 'salio' },
                        { text: "➕ Ongeza Points", callback_data: 'ongeza_points' }
                    ]
                ]
            }
        }
        let other = `Umepokea video ... Umebakiwa na points <b>${rcvr.points}</b>`
        let rtAPI = `https://api.telegram.org/bot${process.env.RT_TOKEN}/sendMessage`
        let plAPI = `https://api.telegram.org/bot${process.env.PL_TOKEN}/sendMessage`
        let mvAPI = `https://api.telegram.org/bot${process.env.MUVIKA_TOKEN}/sendMessage`

        setTimeout(() => {
            if (botname == 'rahatupu_tzbot') {
                axios.post(rtAPI, data)
                    .then(() => {
                        data.text = other.replace('...', 'kutoka kwa <b>@rahatupu_tzbot</b>')
                        data.disable_notification = true
                        data.reply_markup.inline_keyboard[0].shift()
                        axios.post(plAPI, data).catch(e => console.log(e.message))
                        axios.post(mvAPI, data).catch(e => console.log(e.message))
                    }).catch(e => console.log(e.message))
            } else if (botname == 'pilau_bot') {
                axios.post(plAPI, data)
                    .then(() => {
                        data.text = other.replace('...', 'kutoka kwa <b>@pilau_bot.</b>')
                        data.disable_notification = true
                        data.reply_markup.inline_keyboard[0].shift()
                        axios.post(rtAPI, data).catch(e => console.log(e.message))
                        axios.post(mvAPI, data).catch(e => console.log(e.message))
                    }).catch(e => console.log(e.message))
            } else if (botname == 'muvikabot') {
                axios.post(mvAPI, data)
                    .then(() => {
                        data.text = other.replace('video ...', 'Movie kutoka kwa <b>@muvikabot.</b>')
                        data.disable_notification = true
                        data.reply_markup.inline_keyboard[0].shift()
                        axios.post(rtAPI, data).catch(e => console.log(e.message))
                        axios.post(plAPI, data).catch(e => console.log(e.message))
                    }).catch(e => console.log(e.message))
            }
        }, 1000)
    }
}

const payingInfo = async (bot, ctx, delay, imp, userid, mid) => {
    await ctx.sendChatAction('typing')
    await bot.telegram.copyMessage(userid, imp.matangazoDB, mid, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'M-PESA 🇹🇿', callback_data: 'voda' },
                    { text: 'Tigo Pesa 🇹🇿', callback_data: 'tigo' }
                ],
                [
                    { text: 'Airtel 🇹🇿', callback_data: 'airtel' },
                    { text: 'Halotel 🇹🇿', callback_data: 'halotel' }
                ],
                [
                    { text: 'SafariCom 🇰🇪', callback_data: 'safaricom' },
                    { text: 'Uganda 🇺🇬', callback_data: 'uganda' }
                ],
                [
                    { text: '⛑ Get Help (Msaada)', callback_data: 'help-msaada' }
                ]
            ]
        }
    })
}

const addingPoints = async (ctx, chatid, points, imp) => {
    try {
        let android = `https://t.me/+RFRJJNq0ERM1YTBk`
        let iphone = `https://t.me/+dGYRm-FoKJI3MWM8`
        let muvika = `https://t.me/+9CChSlwpGWk2YmI0`

        let upuser = await rtStarterModel.findOneAndUpdate({ chatid }, {
            $inc: { points: points },
            $set: { paid: true }
        }, { new: true })

        let rev = await rtStarterModel.findOneAndUpdate({ chatid: imp.rtmalipo }, { $inc: { revenue: points } }, { new: true })

        let txt1 = `Points za ${upuser.username} zimeongezwa to <b>${upuser.points} pts.</b>\n\n<u>User Data</u>\n• Points: ${upuser.points}\n• Id: ${upuser.chatid}\n• Movies: ${upuser.movie}\n• TV Series: ${upuser.shows}\n\n<tg-spoiler>Mapato added to ${rev.revenue.toLocaleString('en-US')}</tg-spoiler>`

        if (rev.refferer == 'rahatupu_tzbot') { txt1 += '\n\n✅ RTT' }
        else if (rev.refferer == 'pilau_bot') { txt1 += '\n\n✅ PLL' }
        else if (rev.refferer == 'muvikabot') { txt1 += '\n\n✅ MOVIE' }

        let txt2 = `<b>Hongera 🎉 \nMalipo yako yamethibitishwa. Umepokea Points ${points} na sasa una jumla ya Points ${upuser.points} kwenye account yako ya RT Malipo.\n\nTumia points zako vizuri. Kumbuka Kila video utakayo download itakugharimu Points 250.</b>\n\n\n<u><b>RT Premium Links:</b></u>\n\n<b>• Android (Wakubwa 🔞)\n${android}\n\n• iPhone (Wakubwa 🔞)\n${iphone}\n\n• MOVIES:\n${muvika}</b>\n\n\n<b>Enjoy, ❤.</b>`

        let txt3 = `<b>Points ${points} zimeondolewa kwenye account yako na Admin. Umebakiwa na points ${upuser.points}.</b>`

        let rtAPI = `https://api.telegram.org/bot${process.env.RT_TOKEN}/sendMessage`
        let plAPI = `https://api.telegram.org/bot${process.env.PL_TOKEN}/sendMessage`
        let mvAPI = `https://api.telegram.org/bot${process.env.MUVIKA_TOKEN}/sendMessage`


        await ctx.reply(txt1, { parse_mode: 'HTML' })
        let data = { chat_id: chatid, text: txt2, parse_mode: 'HTML' }
        if (points < 0) {
            data.text = txt3
        }
        axios.post(rtAPI, data).catch(e => console.log(e.message))
        axios.post(plAPI, data).catch(e => console.log(e.message))
        axios.post(mvAPI, data).catch(e => console.log(e.message))
    } catch (error) {
        await ctx.reply(error.message)
    }
}

const mtandaoCallBack = async (bot, ctx, chatid, imp, msgid, cbmid) => {
    await bot.telegram.copyMessage(chatid, imp.matangazoDB, msgid, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '✅ Nimelipia Tayari', callback_data: 'nimelipia' }
                ],
                [
                    { text: '← Rudi nyuma', callback_data: 'rudi_nyuma' }
                ]
            ]
        }
    })
    await ctx.deleteMessage(cbmid)
}

const rudiNyumaReply = async (bot, ctx, chatid, imp, msgid, cbmid) => {
    await bot.telegram.copyMessage(chatid, imp.matangazoDB, msgid, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '← Nyuma/Back', callback_data: 'rudi_nyuma' },
                    { text: '⛑ Admin', url: 'https://t.me/rt_malipo' }
                ]
            ]
        }
    })
    await ctx.deleteMessage(cbmid)
}

module.exports = {
    createUser,
    sendPaidVideo,
    payingInfo,
    mtandaoCallBack,
    rudiNyumaReply,
    addingPoints
}