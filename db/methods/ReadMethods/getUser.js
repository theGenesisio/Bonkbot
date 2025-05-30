import User from '../../models/userSchema.js';

/**
 * 📦 Fetch a single user by query.
 * @param Number- The telegram_id
 * @returns {Promise<Object|null>} The user document or null if not found.
 */
const getUser = async (telegram_id) => {
    try {
        const user = await User.findOne({ telegram_id });
        if (!user) {
            console.warn(`⚠️ User with Telegram ID ${telegram_id} not found.`);
            return null;
        }
        return user;
    } catch (error) {
        console.error('❌ Error fetching user:', {
            message: error.message || error,
            stack: error.stack || 'No stack trace available',
        });
        return null;
    }
};

export default getUser;
