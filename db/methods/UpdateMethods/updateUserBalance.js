import User from '../../models/userSchema.js';

/**
 * Updates the SOL balance for a user by telegram_id.
 * @param {number} telegram_id - The Telegram ID of the user.
 * @param {number} newBalance - The new SOL balance to set.
 * @returns {Promise<Object|null>} The updated user document or null if not found/failed.
 */
const updateUserBalance = async (telegram_id, newBalance) => {
    try {
        const user = await User.findOneAndUpdate(
            { telegram_id },
            { $set: { 'wallet.SOL_balance': newBalance } },
            { new: true }
        );
        return user;
    } catch (error) {
        console.error('❌ Error updating user SOL balance:', {
            message: error.message || error,
            stack: error.stack || 'No stack trace available',
        });
        return null;
    }
};

export default updateUserBalance;
