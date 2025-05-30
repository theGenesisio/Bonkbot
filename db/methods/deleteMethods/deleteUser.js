import User from '../../models/userSchema.js';

/**
 * Deletes a user by Telegram ID.
 * @param {Number} telegram_id - The Telegram ID of the user to delete.
 * @returns {Promise<Boolean>} - True if deleted, false otherwise.
 */
const deleteUser = async (telegram_id) => {
    try {
        const result = await User.findOneAndDelete({ telegram_id });
        return !!result; // true if found and deleted, false if not found
    } catch (err) {
        console.error(`❌ Error deleting user ${telegram_id}:`, err);
        return false;
    }
};

export default deleteUser;
