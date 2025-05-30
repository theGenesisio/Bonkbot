import User from '../../models/userSchema.js';
/**
 * Checks if a user is an admin based on their Telegram ID.
 * @param {number} telegramId - The Telegram ID of the user to check.
 * @returns {Promise<boolean>} - Returns true if the user is an admin, false otherwise.
 */

const checkAdmin = async (telegramId) => {
    try {
        // Only find user who is explicitly an admin
        const user = await User.findOne({ telegram_id: telegramId, is_admin: true });

        if (!user) {
            console.warn(`⛔ No admin found with Telegram ID ${telegramId}`);
            return false;
        }

        return true;
    } catch (error) {
        console.error('🔥 Error checking admin status:', {
            message: error.message || error,
            stack: error.stack || 'No stack trace available',
        });
        return false;
    }
};

export default checkAdmin;
