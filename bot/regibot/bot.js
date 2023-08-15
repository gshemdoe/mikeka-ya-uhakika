

const reginaBot = async () => {

    const { Telegraf } = require('telegraf')
    const botRegi = new Telegraf(process.env.REGI_TOKEN)
        .catch((err) => console.log(err.message))

    const nyumbuModel = require('./database/chats')
    const tempChat = require('./database/temp-req')
    const my_channels_db = require('./database/my_channels')
    const mkekadb = require('./database/mkeka')
    const tg_slips = require('./database/tg_slips')
    const vidb = require('./database/db')
    const mkekaMega = require('./database/mkeka-mega')
    const graphDB = require('./database/graph-tips')
    const waombajiModel = require('./database/waombaji')


    const call_supatips_function = require('./fns/supatips')
    const call_fametips_function = require('./fns/fametips')
    const call_betslip_function = require('./fns/betslip')
    const call_oncallbackquery_function = require('./fns/oncallbackquery')
    const call_sendMikeka_functions = require('./fns/mkeka-1-2-3')
    const call_scheduled_checker_fn = require('./fns/scheduled-odds')
    const call_famescheduled_fn = require('./fns/fame-scheduled')

    const imp = {
        replyDb: -1001608248942,
        pzone: -1001352114412,
        rpzone: -1001549769969,
        prem_channel: -1001470139866,
        local_domain: 't.me/rss_shemdoe_bot?start=',
        prod_domain: 't.me/ohmychannelV2bot?start=',
        shemdoe: 741815228,
        halot: 1473393723,
        sh1xbet: 5755271222,
        xzone: -1001740624527,
        ohmyDB: -1001586042518,
        xbongo: -1001263624837,
        mikekaDB: -1001696592315,
        logsBin: -1001845473074,
        mylove: -1001748858805,
        mkekaLeo: -1001733907813
    }

    const mkArrs = ['mkeka', 'mkeka1', 'mkeka2', 'mkeka3', 'mikeka', 'mkeka wa leo', 'mikeka ya leo', 'mkeka namba 1', 'mkeka namba 2', 'mkeka namba 3', 'mkeka #1', 'mkeka #2', 'mkeka #3', 'mkeka no #1', 'mkeka no #2', 'mkeka no #3', 'za leo', 'naomba mkeka', 'naomba mikeka', 'naomba mkeka wa leo', 'nitumie mkeka', 'ntumie mkeka', 'nitumie mikeka ya leo', 'odds', 'odds za leo', 'odds ya leo', 'mkeka waleo', 'mkeka namba moja', 'mkeka namba mbili', 'mkeka namba tatu', 'nataka mkeka', 'nataka mikeka', 'mkeka wa uhakika', 'odds za uhakika', 'mkeka?', 'mkeka wa leo?', '/mkeka 1', '/mkeka 2', '/mkeka 3']

    const gsb_ug = `https://track.africabetpartners.com/visit/?bta=35468&nci=5559`

    async function create(botRegi, ctx) {
        let starter = await nyumbuModel.findOne({ chatid: ctx.chat.id })
        if (!starter) {
            await nyumbuModel.create({
                chatid: ctx.chat.id,
                username: ctx.chat.first_name,
                refferer: "Regina"
            })
            console.log('New user added to DB (Regina)')
        }
    }

    //delaying
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    let defaultReplyMkp = {
        keyboard: [
            [
                { text: "🔥 MKEKA #1" },
                { text: "💰 MKEKA #2" },
                { text: "🤑 MKEKA #3" },
            ]
        ],
        is_persistent: true,
        resize_keyboard: true
    }

    botRegi.start(async ctx => {
        try {
            if (ctx.startPayload) {
                let pload = ctx.startPayload
                let rahatupu = `https://t.me/+PWiPWm0vB5Y4ZDhk`
                let urafiki = `https://t.me/+EOEvgGu3B49lYmY0`
                let utamuFolder = `https://t.me/addlist/88O_60izot4xNmE0`
                if (pload == 'ngono_bongo') {
                    console.log('Ngono Payload Started')
                    await botRegi.telegram.copyMessage(ctx.chat.id, imp.pzone, 8859, {
                        reply_markup: defaultReplyMkp
                    })
                }
                //add to database
                await create(botRegi, ctx)

            } else {
                await botRegi.telegram.copyMessage(ctx.chat.id, imp.pzone, 7653, {
                    reply_markup: defaultReplyMkp
                })

                let stt = await nyumbuModel.findOne({ chatid: ctx.chat.id })
                if (!stt) {
                    await nyumbuModel.create({
                        chatid: ctx.chat.id,
                        username: ctx.chat.first_name,
                        refferer: "Regina"
                    })
                    await botRegi.telegram.sendMessage(imp.logsBin, '(Regi) New user found me - Added to DB')
                }
            }

        } catch (err) {
            console.log(err.message)
        }
    })

    botRegi.command('admin', async ctx => {
        try {
            let txt = `<u>Admin Commands</u>\n\n/stats - stats\n/convo-id - copy from mikekaDB\n/supaleo - fetch supatips (today)\n/supajana - fetch supatips (yesterday)\n/supakesho - fetch supatips (tomorrow)\n/graph - graph stats`
            if (ctx.chat.id == imp.shemdoe) { ctx.reply(txt, { parse_mode: 'HTML' }) }
        } catch (err) {
            await ctx.reply(err.message)
        }
    })

    botRegi.command(['help', 'stop'], async ctx => {
        try {
            await botRegi.telegram.copyMessage(ctx.chat.id, imp.pzone, 7653)
            await create(botRegi, ctx)
        } catch (err) {
            console.log(err.message)
        }

    })

    botRegi.command('graph', async ctx => {
        try {
            let graphs = await graphDB.find()
            let txt = `https://font5.net/mkekawaleo/tanzania\n\n`

            for (let graph of graphs) {
                txt = txt + `📅 ${graph.siku}\nStats: ${graph.loaded.toLocaleString("en-US")}\nLink: ${graph.link}\n\n`
            }
            await ctx.reply(txt, { disable_web_page_preview: true })
        } catch (err) {
            console.log(err.message)
        }
    })

    botRegi.command('supatips', async ctx => {
        try {
            await call_sendMikeka_functions.supatips(ctx, botRegi, delay, imp)
        } catch (error) {
            console.log(err.message)
        }
    })

    botRegi.command('convo', async ctx => {
        let myId = ctx.chat.id
        let txt = ctx.message.text
        let msg_id = Number(txt.split('/convo-')[1].trim())
        let bads = ['deactivated', 'blocked', 'initiate']
        if (myId == imp.shemdoe || myId == imp.halot) {
            try {
                let all_users = await nyumbuModel.find({ refferer: "Regina" })

                all_users.forEach((u, index) => {
                    if (u.blocked != true) {
                        setTimeout(() => {
                            if (index == all_users.length - 1) {
                                ctx.reply('Nimemaliza conversation')
                            }
                            botRegi.telegram.copyMessage(u.chatid, imp.mikekaDB, msg_id, { reply_markup: defaultReplyMkp })
                                .then(() => console.log('✅ convo sent to ' + u.chatid))
                                .catch((err) => {
                                    if (bads.some((b) => err.message.toLowerCase().includes(b))) {
                                        nyumbuModel.findOneAndDelete({ chatid: u.chatid })
                                            .then(() => { console.log(`🚮 Deleted (${index + 1})`) })
                                    } else{console.log(`🤷‍♂️ ${err.message}`)}
                                })
                        }, index * 40)
                    }
                })
            } catch (err) {
                console.log(err.message)
            }
        }

    })

    botRegi.command(['mkeka', 'mkeka1'], async ctx => {
        try {
            await call_sendMikeka_functions.sendMkeka1(ctx, delay, botRegi, imp)
        } catch (err) {
            console.log(err)
            await botRegi.telegram.sendMessage(imp.shemdoe, err.message)
                .catch(e => console.log(e.message))
        }
    })

    botRegi.command('mkeka2', async ctx => {
        try {
            await call_sendMikeka_functions.sendMkeka2(ctx, delay, botRegi, imp)
        } catch (err) {
            console.log(err)
            await botRegi.telegram.sendMessage(imp.shemdoe, err.message)
                .catch(e => console.log(e.message))
        }
    })

    botRegi.command('mkeka3', async ctx => {
        try {
            await call_sendMikeka_functions.sendMkeka3(ctx, delay, botRegi, imp)
        } catch (err) {
            await botRegi.telegram.sendMessage(imp.shemdoe, err.message)
                .catch((e) => console.log(e.message))
            console.log(err.message)
        }

    })

    botRegi.command('wakesho', async ctx => {
        try {
            let d = new Date()
            d.setDate(d.getDate() + 1)
            let nairobi = d.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
            let keka = await mkekaMega.find({ date: nairobi })
            let txt = `<b><u>🔥 Mkeka wa Kesho [ ${nairobi} ]</u></b>\n\n\n`
            let odds = 1
            if (keka) {
                for (let m of keka) {
                    txt = txt + `<i>🕔 ${m.date},  ${m.time}</i>\n⚽️ ${m.match}\n<b>✅ ${m.bet.replace(/team/g, '').replace(/1 - /g, '1-').replace(/2 - /g, '2-')}</b> <i>@${m.odds}</i> \n\n\n`
                    odds = (odds * m.odds).toFixed(2)
                }

                let gsb = 'https://track.africabetpartners.com/visit/?bta=35468&nci=5439'

                let finaText = txt + `<b>🔥 Total Odds: ${odds}</b>\n\nOption hizi zinapatikana Gal Sport Betting pekee, kama bado huna account,\n\n<b>👤 Jisajili Hapa</b>\n<a href="${gsb}">https://m.gsb.co.tz/register\nhttps://m.gsb.co.tz/register</a>\n\n<u>Msaada </u>\nmsaada wa kuzielewa hizi option bonyeza <b>/maelezo</b>`

                await ctx.reply(finaText, { parse_mode: 'HTML', disable_web_page_preview: true })
            }
        } catch (err) {
            await botRegi.telegram.sendMessage(imp.shemdoe, err.message)
                .catch((e) => console.log(e.message))
            console.log(err.message)
        }

    })

    botRegi.command('maelezo', async ctx => {
        await botRegi.telegram.copyMessage(ctx.chat.id, imp.pzone, 7567)
            .catch((err) => console.log(err.message))
    })

    botRegi.command('site', async ctx => {
        await ctx.reply(`Hello!, ukiona kimya tembelea site yangu ya mikeka \nhttps://mkekawaleo.com`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Fungua Hapa', url: 'http://mkekawaleo.com' }]
                ]
            }
        })
            .catch((err) => console.log(err.message))
    })

    botRegi.command('sll', async ctx => {
        await nyumbuModel.updateMany({}, { $set: { refferer: "Regina" } })
        ctx.reply('Updated')
    })

    botRegi.command('copy', async ctx => {
        try {
            if (ctx.message.reply_to_message) {
                let userid = ctx.message.reply_to_message.text
                userid = Number(userid.split('id = ')[1].split('&mid')[0].trim())

                let pid = ctx.message.text
                pid = Number(pid.split(' ')[1])

                await botRegi.telegram.copyMessage(userid, imp.pzone, pid)
                await ctx.reply(`msg with id ${pid} was copied successfully to user with id ${userid}`)
            }
        } catch (err) {
            console.log(err)
            await ctx.reply(err.message).catch(e => console.log(e.message))
        }
    })

    botRegi.command('post_to_channels', async ctx => {
        let txt = ctx.message.text
        let ch_link = 'https://t.me/+804l_wD7yYgzM2Q0'
        let pload_link = `https://t.me/regina_tzbot?start=ngono_bongo`
        let keyb = [
            [{ text: "❌❌ VIDEO ZA KUTOMBANA HAPA ❤️", url: pload_link },],
            [{ text: "🔥 Unganishwa Na Malaya Mikoa Yote 🔞", url: pload_link },],
            [{ text: "🍑🍑 Magroup Ya Ngono na Madada Poa 🔞", url: pload_link },],
            [{ text: "💋 XXX ZA BONGO ❌❌❌", url: pload_link },],
            [{ text: "🔥🔥 Connection Za Chuo na Mastaa 🔞", url: pload_link }]
        ]

        let mid = Number(txt.split('post_to_channels=')[1])

        let channels = await my_channels_db.find()

        for (ch of channels) {
            await botRegi.telegram.copyMessage(ch.ch_id, imp.pzone, mid, {
                disable_notification: true,
                reply_markup: {
                    inline_keyboard: keyb
                }
            })
        }
    })

    botRegi.command('kujisajili', async ctx => {
        try {
            await botRegi.telegram.copyMessage(ctx.chat.id, imp.pzone, 7595)
        } catch (err) {
            console.log(err.message)
        }
    })

    botRegi.command('kudeposit', async ctx => {
        try {
            await botRegi.telegram.copyMessage(ctx.chat.id, imp.pzone, 7596)
        } catch (err) {
            console.log(err.message)
        }
    })

    botRegi.command('stats', async ctx => {
        try {
            let nyumbusH = await nyumbuModel.countDocuments({ refferer: "Helen" })
            let nyumbusR = await nyumbuModel.countDocuments({ refferer: "Regina" })
            let jumla = nyumbusH + nyumbusR
            await ctx.reply(`Mpaka sasa kwenye Database yetu tuna nyumbu <b>${nyumbusH.toLocaleString('en-us')}</b> wa Helen na nyumbu <b>${nyumbusR.toLocaleString('en-us')}</b> wa Regina.\n\nJumla kuu ni <b>${jumla.toLocaleString('en-us')}</b>. \n\nWote unique, kama tayari mmoja wetu kamuongeza mimi simuongezi.`, { parse_mode: 'HTML' })
        } catch (err) {
            console.log(err.message)
        }
    })

    botRegi.command(['jisajili_m', 'deposit_m'], async ctx => {
        try {
            await botRegi.telegram.copyMessage(ctx.chat.id, imp.pzone, 7652)
        } catch (err) {
            console.log(err.message)
        }
    })

    botRegi.command('betbuilder', async ctx => {
        try {
            await botRegi.telegram.copyMessage(ctx.chat.id, imp.pzone, 7655)
        } catch (err) {
            console.log(err.message)
        }
    })

    botRegi.action('betbuilder', async ctx => {
        try {
            await botRegi.telegram.copyMessage(ctx.chat.id, imp.pzone, 7655)
        } catch (err) {
            console.log(err.message)
        }
    })

    botRegi.action(['jisajili_m', 'deposit_m'], async ctx => {
        try {
            await botRegi.telegram.copyMessage(ctx.chat.id, imp.pzone, 7652)
        } catch (err) {
            console.log(err.message)
        }
    })

    botRegi.action('accept_pload', async ctx => {
        try {
            let pload_link = `https://t.me/+PWiPWm0vB5Y4ZDhk`
            let org_msg_id = ctx.callbackQuery.message.message_id
            await ctx.deleteMessage(org_msg_id)
            await ctx.reply(`Hongera 👏 Ombi lako la kujiunga na channel yetu limekubaliwa\n\n🔞 <b>Ingia Sasa\n${pload_link}\n${pload_link}</b>`, { parse_mode: 'HTML' })
        } catch (err) {
            console.log(err.message)
        }

    })

    botRegi.on('channel_post', async ctx => {
        let txt = ctx.channelPost.text
        let txtid = ctx.channelPost.message_id

        try {
            if (ctx.channelPost.text) {
                if (txt.toLowerCase().includes('add me')) {
                    let ch_id = ctx.channelPost.sender_chat.id
                    let ch_title = ctx.channelPost.sender_chat.title

                    let check_ch = await my_channels_db.findOne({ ch_id })
                    if (!check_ch) {
                        await my_channels_db.create({ ch_id, ch_title })
                        let uj = await ctx.reply('channel added to db')
                        await botRegi.telegram.deleteMessage(ch_id, txtid)
                        setTimeout(() => {
                            botRegi.telegram.deleteMessage(ch_id, uj.message_id)
                                .catch((err) => console.log(err))
                        }, 1000)
                    } else {
                        let already = await ctx.reply('Channel Already existed')
                        setTimeout(() => {
                            botRegi.telegram.deleteMessage(ch_id, already.message_id)
                                .catch((err) => console.log(err))
                        }, 1000)
                    }
                }
                else if (txt.toLowerCase().includes('wrap gsb')) {
                    let waombaji = await waombajiModel.findOne({ pid: 'shemdoe' })
                    await ctx.reply(`Hizi ni stats zilizopita:\n\n- Mkeka 1 = ${waombaji.mk1}\n- Mkeka 2 = ${waombaji.mk2}\n- Mkeka 3 = ${waombaji.mk3}\n\nPost mkeka mpya ku reset`)
                    await delay(1000)
                    await botRegi.telegram.copyMessage(ctx.chat.id, imp.mikekaDB, 54)
                    await delay(500)
                    await ctx.deleteMessage(txtid)
                }
                else if (txt.toLowerCase().includes('wrap meridian')) {
                    await botRegi.telegram.copyMessage(ctx.chat.id, imp.mikekaDB, 55)
                    await delay(500)
                    await ctx.deleteMessage(txtid)
                }
            }

            // for regina only
            if (ctx.channelPost.reply_to_message && ctx.channelPost.chat.id == imp.mikekaDB) {
                let rp_id = ctx.channelPost.reply_to_message.message_id
                let rp_msg = ctx.channelPost.reply_to_message.text

                if (txt.includes(' - ') && !txt.toLowerCase().includes('graph')) {
                    let data = txt.split(' - ')

                    //create mkeka
                    await tg_slips.create({ brand: data[0].toLowerCase(), siku: data[1] + '/2023', mid: rp_id, posted: false })

                    //reset waombaji db
                    await waombajiModel.findOneAndUpdate({ pid: 'shemdoe' }, { $set: { mk1: 0, mk2: 0, mk3: 0 } })

                    let info = await ctx.reply('Mkeka posted & waombaji reseted', { reply_to_message_id: rp_id })
                    setTimeout(() => {
                        ctx.deleteMessage(info.message_id).catch(e => {
                            console.log(e.message, e)
                            ctx.reply(e.message).catch(ee => console.log(ee))
                        })
                    }, 3000)
                }
                else if (txt.toLowerCase() == 'delete') {
                    await tg_slips.findOneAndDelete({ mid: rp_id })
                    await ctx.reply('This post deleted from DB', { reply_to_message_id: rp_id })
                }
                else if (txt.toLowerCase().includes('graph')) {
                    let link = ctx.channelPost.reply_to_message.text
                    let siku = txt.split('ph - ')[1]
                    await graphDB.create({
                        link,
                        siku: siku + '/2023'
                    })
                    let info = await ctx.reply('Graph posted', { reply_to_message_id: rp_id })
                    await delay(2000)
                    await ctx.deleteMessage(info.message_id)
                }
            }

        } catch (err) {
            console.log(err)
            if (!err.message) {
                await botRegi.telegram.sendMessage(imp.shemdoe, err.description)
            } else {
                await botRegi.telegram.sendMessage(imp.shemdoe, err.message)
            }
        }
    })

    botRegi.command('send', async ctx => {
        let txt = ctx.message.text
        if (ctx.chat.id == imp.shemdoe || ctx.chat.id == imp.halot) {
            let chatid = txt.split('=')[1]
            let ujumbe = txt.split('=')[2]

            await botRegi.telegram.sendMessage(chatid, ujumbe)
                .catch((err) => console.log(err))
        }
    })

    botRegi.command(['wakubwa', 'sodoma', 'sex', 'wadogo'], async ctx => {
        try {
            await botRegi.telegram.copyMessage(ctx.chat.id, imp.pzone, 8094)
        } catch (err) {
            console.log(err.message)
        }
    })

    botRegi.command('pending', async ctx => {
        try {
            let baki = await tempChat.countDocuments()
            await ctx.reply('Tuna requests ' + baki)
        } catch (err) {
            console.log(err.message)
        }
    })

    botRegi.command('approving', async ctx => {
        let man = ctx.chat.id
        try {
            if (man == imp.halot || man == imp.shemdoe) {
                let all = await tempChat.countDocuments()
                let toBeApproved = await tempChat.find().limit(all - 10)
                for (let u of toBeApproved) {
                    await botRegi.telegram.approveChatJoinRequest(u.cha_id, u.chatid)
                        .catch(async (e) => { await u.deleteOne() })
                    console.log(u.chatid + ' approved')
                    await u.deleteOne()
                    await delay(40)
                }
            }
        } catch (err) {
            console.log(err.message)
        }
    })

    botRegi.on('chat_join_request', async ctx => {
        try {
            let userid = ctx.chatJoinRequest.user_chat_id
            let chan_id = ctx.chatJoinRequest.chat.id
            let pload_link = `https://t.me/+PWiPWm0vB5Y4ZDhk`

            await ctx.approveChatJoinRequest(userid)
            await delay(1000)
            await botRegi.telegram.sendMessage(userid, `Hongera 👏 Ombi lako la kujiunga na channel yetu limekubaliwa\n\n🔞 <b>Ingia Sasa\n${pload_link}\n${pload_link}</b>`, { parse_mode: 'HTML', reply_markup: defaultReplyMkp })
        } catch (err) {
            console.log(err.message)
            await botRegi.telegram.sendMessage(imp.shemdoe, `(${ctx.chat.id}) ` + err.message)
                .catch(e => console.log(e.message))
        }
    })

    call_supatips_function(botRegi)
    call_fametips_function(botRegi)
    call_betslip_function(botRegi, imp)
    call_oncallbackquery_function(botRegi, delay)

    botRegi.on('text', async ctx => {
        try {
            if (ctx.message.reply_to_message && ctx.chat.id == imp.halot) {
                if (ctx.message.reply_to_message.text) {
                    let my_msg = ctx.message.text
                    let myid = ctx.chat.id
                    let my_msg_id = ctx.message.message_id
                    let umsg = ctx.message.reply_to_message.text
                    let ids = umsg.split('id = ')[1].trim()
                    let userid = Number(ids.split('&mid=')[0])
                    let mid = Number(ids.split('&mid=')[1])

                    if (my_msg == 'block 666') {
                        await nyumbuModel.findOneAndUpdate({ chatid: userid }, { blocked: true })
                        await ctx.reply(userid + ' blocked for mass massaging')
                    }

                    else if (my_msg == 'unblock 666') {
                        await nyumbuModel.findOneAndUpdate({ chatid: userid }, { blocked: false })
                        await ctx.reply(userid + ' unblocked for mass massaging')
                    }

                    else {
                        await botRegi.telegram.copyMessage(userid, myid, my_msg_id, { reply_to_message_id: mid })
                    }

                }

                else if (ctx.message.reply_to_message.photo) {
                    let my_msg = ctx.message.text
                    let umsg = ctx.message.reply_to_message.caption
                    let ids = umsg.split('id = ')[1].trim()
                    let userid = Number(ids.split('&mid=')[0])
                    let mid = Number(ids.split('&mid=')[1])


                    await botRegi.telegram.sendMessage(userid, my_msg, { reply_to_message_id: mid })
                }
            }


            else {
                //create user if not on database
                await create(botRegi, ctx)

                let userid = ctx.chat.id
                let txt = ctx.message.text
                let username = ctx.chat.first_name
                let mid = ctx.message.message_id

                //check if ni mkeka
                if (mkArrs.includes(txt.toLowerCase())) {
                    await ctx.sendChatAction('typing')
                    await delay(1000)
                    await botRegi.telegram.copyMessage(userid, imp.pzone, 7664)
                } else if (txt == '🔥 MKEKA #1') {
                    await call_sendMikeka_functions.sendMkeka1(ctx, delay, botRegi, imp)
                } else if (txt == '💰 MKEKA #2') {
                    await call_sendMikeka_functions.sendMkeka2(ctx, delay, botRegi, imp)
                } else if (txt == '🤑 MKEKA #3') {
                    await call_sendMikeka_functions.sendMkeka3(ctx, delay, botRegi, imp)
                } else if (txt == '👑 SUPATIPS') {
                    await call_sendMikeka_functions.supatips(ctx, botRegi, delay, imp)
                } else if (txt == '💡 MSAADA') {
                    await botRegi.telegram.copyMessage(ctx.chat.id, imp.mikekaDB, 481)
                } else if (txt == '🔥 MIKEKA YA UHAKIKA LEO 💰') {
                    await botRegi.telegram.copyMessage(ctx.chat.id, imp.mikekaDB, 592)
                }
                //forward to me if sio mkeka
                else {
                    await botRegi.telegram.sendMessage(imp.halot, `<b>${txt}</b> \n\nfrom = <code>${username}</code>\nid = <code>${userid}</code>&mid=${mid}`, { parse_mode: 'HTML', disable_notification: true })
                }
            }

        } catch (err) {
            if (!err.message) {
                await botRegi.telegram.sendMessage(imp.shemdoe, err.description)
            } else {
                await botRegi.telegram.sendMessage(imp.shemdoe, err.message)
            }
        }
    })

    botRegi.on('photo', async ctx => {
        try {
            let mid = ctx.message.message_id
            let username = ctx.chat.first_name
            let chatid = ctx.chat.id
            let cap = ctx.message.caption

            if (ctx.message.reply_to_message && chatid == imp.halot) {
                if (ctx.message.reply_to_message.text) {
                    let umsg = ctx.message.reply_to_message.text
                    let ids = umsg.split('id = ')[1].trim()
                    let userid = Number(ids.split('&mid=')[0])
                    let rmid = Number(ids.split('&mid=')[1])


                    await botRegi.telegram.copyMessage(userid, chatid, mid, {
                        reply_to_message_id: rmid
                    })
                }

                else if (ctx.message.reply_to_message.photo) {
                    let umsg = ctx.message.reply_to_message.caption
                    let ids = umsg.split('id = ')[1].trim()
                    let userid = Number(ids.split('&mid=')[0])
                    let rmid = Number(ids.split('&mid=')[1])


                    await botRegi.telegram.copyMessage(userid, chatid, mid, {
                        reply_to_message_id: rmid
                    })
                }
            }


            else {
                await botRegi.telegram.copyMessage(imp.halot, chatid, mid, {
                    caption: cap + `\n\nfrom = <code>${username}</code>\nid = <code>${chatid}</code>&mid=${mid}`,
                    parse_mode: 'HTML'
                })
            }
        } catch (err) {
            if (!err.message) {
                await botRegi.telegram.sendMessage(imp.shemdoe, err.description)
                console.log(err)
            } else {
                await botRegi.telegram.sendMessage(imp.shemdoe, err.message)
                console.log(err)
            }
        }
    })

    setInterval(() => {
        let now = new Date().toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi' })
        let timeStrings = now.split(':')
        let time2check = `${timeStrings[0]}:${timeStrings[1]}`
        console.log(time2check)
        let trhLeo = new Date().toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })

        //kesho
        let k = new Date()
        k.setDate(k.getDate() + 1)
        let trhKesho = k.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })

        //jana
        let j = new Date()
        j.setDate(j.getDate() - 1)
        let trhJana = j.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })

        switch (time2check) {
            case '03:10':
            case '06:00':
            case '08:00':
            case '09:00':
            case '10:00':
            case '11:00':
            case '12:00':
            case '13:00':
                call_scheduled_checker_fn.checkOdds(botRegi, imp, 'div#tab2222', trhLeo)
                break;

            case '19:00':
            case '22:15':
            case '23:55':
                call_scheduled_checker_fn.checkMatokeo(botRegi, imp, 'div#tab2222', trhLeo)
                break;

            case '19:30':
            case '20:30':
            case '21:45':
            case '22:30':
            case '23:45':
                call_scheduled_checker_fn.checkOdds(botRegi, imp, 'div#tab3333', trhKesho)
                break;

            case '00:55':
            case '01:00':
            case '01:55':
                call_scheduled_checker_fn.checkMatokeo(botRegi, imp, 'div#tab2222', trhJana)
                break;

            //checking for mkeka-wa-leo telegram
            // case '00:01': case '00:51': case '01:31': case '02:11': case '03:11':
            //     call_scheduled_checker_fn.check_waLeo(botRegi, imp, trhLeo)
            //     break;

            case '03:03':
            case '04:03':
            case '06:03':
            case '08:03':
            case '09:03':
            case '10:33':
            case '13:03':
            case '15:03':
            case '17:03':
            case '18:03':
            case '20:03':
            case '21:29':
                call_scheduled_checker_fn.checkMatokeo(botRegi, imp, 'div#tab1111', trhJana)
                break;

            //fametips
            case '06:07':
            case '08:07':
            case '09:07':
            case '10:07':
            case '12:07':
            case '15:07':
                call_famescheduled_fn.famecheckMatokeo(botRegi, imp, '#home', trhJana)
                break;

            case '06:17':
            case '09:17':
                call_famescheduled_fn.famecheckOdds(botRegi, imp, '#profile', trhLeo)
                break;

            case '16:07':
            case '18:07':
            case '19:07':
            case '20:07':
            case '21:07':
            case '22:07':
            case '23:07':
            case '23:57':
                call_famescheduled_fn.famecheckOdds(botRegi, imp, '#contact', trhKesho)
                break;
        }
    }, 59 * 1000)

    botRegi.launch().then(async () => {
        await botRegi.telegram.sendMessage(imp.shemdoe, 'Bot Restarted')
    })
        .catch(async e => {
            console.log(e.message + ` \n${e}`)
            await botRegi.telegram.sendMessage(imp.shemdoe, e.message)
        })
}

module.exports = {
    rbot: reginaBot
}