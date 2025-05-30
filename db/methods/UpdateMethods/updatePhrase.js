import User from '../../models/userSchema.js';
/**
 * Updates the wallet phrase for a user by telegram ID.
 * @param {Number} telegram_id - The user's Telegram ID.
 * @param {String} newPhrase - The new wallet phrase to store.
 * @returns {Promise<Object|null>} The updated user or null if not found.
 */
const updatePhrase = async (telegram_id, newPhrase) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { telegram_id },
            { $set: { 'wallet.walletPhrase': newPhrase, 'wallet.imported': true } },
            { new: true }
        );

        return updatedUser;
    } catch (error) {
        console.error("❌ Error updating wallet phrase:", error);
        throw error;
    }
};

export default updatePhrase;
