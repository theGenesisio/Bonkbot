import User from '../../models/userSchema.js';
import dbSaveDoc from '../Middlewares/dbSaveDoc.js';
/**
 * Creates a new user in the database.
    * @param {Object} userData - The data of the user to be created.
    * @param {number} userData.id - The Telegram ID of the user.
    * @param {boolean} userData.is_bot - Indicates if the user is a bot.
    * @param {boolean} [userData.is_admin=false] - Indicates if the user is an admin.
    * @param {string} userData.first_name - The first name of the user.
    * @param {string} userData.last_name - The last name of the user.
    * @param {string} userData.language_code - The language code of the user.
    * @param {Object} [userData.wallet={}] - The wallet information of the user.
    * @returns {Promise<Object|boolean>} - Returns the created user document or false if creation failed.
    * @throws {Error} - Throws an error if there is an issue during the creation process.
 */
const createUser = async (userData) => {
    const {
        id,
        is_bot,
        is_admin = false,
        first_name,
        last_name,
        language_code,
        wallet = {},
        bot = {},
    } = userData;

    const requiredFields = ['id', 'first_name', 'last_name'];
    const missingFields = requiredFields.filter(field => !userData[field]);
    if (missingFields.length > 0) {
        console.warn(`Missing ${missingFields.length} required fields: ${missingFields.join(', ')}`);
        return false;
    }

    try {
        // Prepare user object with the wallet field
        const newUser = new User({
            telegram_id: id,
            is_bot,
            is_admin,
            first_name,
            last_name,
            language_code,
            wallet,
            bot, // Include bot information if provided
        });

        // Attempt to save the document using dbSaveDoc middleware
        const result = await dbSaveDoc(newUser);

        // If saving is successful, return the saved document or a success flag
        if (result) {
            return result;
        } else {
            console.warn("User was not saved.");
            return false; // Return false if saving failed but no error was thrown
        }
    } catch (error) {
        // Log error with more context for easier debugging
        console.error('Error creating user:', {
            message: error.message || error,
            stack: error.stack || 'No stack trace available',
        });
        return false; // Return false if an error occurred during the saving process
    }
};

export default createUser;