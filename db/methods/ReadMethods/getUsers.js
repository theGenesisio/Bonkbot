import User from '../../models/userSchema.js';

/**
 * 📦 Fetch all users sorted by their last update time (most recent first).
 * @returns {Promise<Array>} An array of user documents or an empty array on failure.
 */
const getUsers = async () => {
    try {
        const users = await User.find({}).sort({ updatedAt: -1 }); // -1 = descending
        return users;
    } catch (error) {
        console.error('❌ Error fetching users:', {
            message: error.message || error,
            stack: error.stack || 'No stack trace available',
        });
        return [];
    }
};

export default getUsers;
