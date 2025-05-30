const registerSystemHandlers = (bot) => {
    // Polling error
    bot.on('polling_error', (err) => {
        console.error('🚨 Polling error:', err.code, err.response?.body || err.message);
    });

    // Webhook error
    bot.on('webhook_error', (err) => {
        console.error('🚨 Webhook error:', err.code, err.response?.body || err.message);
    });

    // Inline query
    bot.on('inline_query', (query) => {
        console.log("🔍 Inline Query:");
        console.dir(query, { depth: null });

        // Optional: Respond to inline query
        const results = [
            {
                type: 'article',
                id: '1',
                title: 'Sample Inline Result',
                input_message_content: {
                    message_text: 'You selected this from inline mode',
                },
            },
        ];

        bot.answerInlineQuery(query.id, results);
    });
};

export default registerSystemHandlers;
