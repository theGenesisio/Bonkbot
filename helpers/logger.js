function logMsgContext(msg, commandName) {
    const {
        from: { id: userId, username, first_name, last_name },
        chat: { id: chatId, type: chatType, title },
        date,
        message_id,
        text
    } = msg;

    const timestamp = new Date(date * 1000).toISOString();
    console.log(`[${timestamp}] ${commandName} triggered`);
    console.log(`• From: ${first_name || ''} ${last_name || ''} (@${username || 'N/A'}) [ID: ${userId}]`);
    console.log(`• Chat: ${chatType} ${chatType === 'group' ? `(${title})` : ''} [ID: ${chatId}]`);
    console.log(`• Msg ID: ${message_id}`);
    console.log(`• Text: ${text}`);
    console.log(`-----------------------------`);
}
export default logMsgContext;
// This function logs the context of a Telegram message, including user and chat details, command name, and message text.