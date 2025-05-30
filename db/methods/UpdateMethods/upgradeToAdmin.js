import User from '../../models/userSchema.js';

/**
 * Toggle the is_admin status of a user by Telegram ID.
 * @param {Number} telegramId - The user's Telegram ID.
 * @returns {Object|null} - Updated user or null if not found.
 */
const toggleAdminStatus = async (telegramId) => {
    try {
        const user = await User.findOne({ telegram_id: telegramId });

        if (!user) {
            console.warn(`⚠️ User with Telegram ID ${telegramId} not found.`);
            return null;
        }

        user.is_admin = !user.is_admin;
        await user.save();

        console.log(`🔁 Admin status toggled. New is_admin: ${user.is_admin}`);
        return user;
    } catch (err) {
        console.error('❌ Error toggling admin status:', {
            message: err.message || err,
            stack: err.stack || 'No stack trace',
        });
        return null;
    }
};

export default toggleAdminStatus;
