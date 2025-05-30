import User from '../../models/userSchema.js';
/**
 * Finds the wallet balance of a user by their Telegram ID.
 * @param {number} userId - The Telegram ID of the user.
 * @returns {Promise<number|null>} - The user's wallet balance or null if not found or an error occurs.
 */
const findUserWalletBalance = async (userId) => {
    try {
        // Find the user by their Telegram ID
        const user = await User.findOne({ telegram_id: userId });
        if (!user) {
            console.warn(`User with ID ${userId} not found.`);
            return null; // Return null if user is not found
        }
        // Return the wallet balance
        return user.wallet.SOL_balance || 0; // Return the balance or 0 if not set
    }
    catch (error) {
        // Log error with more context for easier debugging
        console.error('Error finding user wallet balance:', {
            message: error.message || error,
            stack: error.stack || 'No stack trace available',
        });
        return null; // Return null if an error occurred
    }
}
export default findUserWalletBalance;