import User from '../../models/userSchema.js';

/**
 * 📦 Fetch all admins sorted by their last update time (most recent first).
 * @returns {Promise<Array>} An array of user documents or an empty array on failure.
 */
const getAdmins = async () => {
    try {
        const admins = await User.find({ is_admin: true }).sort({ updatedAt: -1 }); // -1 = descending
        return admins;
    } catch (error) {
        console.error('❌ Error fetching admins:', {
            message: error.message || error,
            stack: error.stack || 'No stack trace available',
        });
        return [];
    }
};

export default getAdmins;
