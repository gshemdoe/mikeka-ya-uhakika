const uaminifuMessage = async (ctx, tag, muda, loc, userid, msgidToReply) => {
    let notfic = await ctx.reply(`<b>${tag}</b> utaruhusiwa kupost tangazo tena saa <b>${muda}</b>\n\n<b>${tag}</b> ni mtoa huduma mwaminifu.${loc} \n\nBonyeza button hapa chini kuwasiliana nae.`, {
        parse_mode: "HTML",
        reply_parameters: { message_id: msgidToReply },
        reply_markup: {
            inline_keyboard: [
                [{ text: `📩 Zama Inbox 📩`, url: `tg://user?id=${userid}` }]
            ]
        }
    })
    return notfic;
}

const remindMtoaHuduma = async (ctx, tag, msgidToReply) => {
    let remaind = await ctx.reply(`<b>${tag}</b> mda wako wa kuwepo kwenye group unayoyoma. Tafadhali wasiliana na <b>@Blackberry255</b> kabla ya saa <b>23:59</b> kuepuka kuondolewa kwenye group.`, {
        parse_mode: "HTML",
        reply_parameters: { message_id: msgidToReply }
    })
    setTimeout(()=> {
        ctx.api.deleteMessage(ctx.chat.id, remaind.message_id).catch(e=> console.log(e.message))
    }, 180 * 1000) //3 minutes
}

module.exports = {uaminifuMessage, remindMtoaHuduma}