import mongoose, { Schema } from 'mongoose'
// This schema defines the structure of the user document in the MongoDB database
// It includes fields for Telegram ID, bot status, admin status, user names, language code, and wallet information.
const botSchema = new Schema({
    SOL_address: { type: String, default: 'AAk24Eoz2WpgiRXF829RrwxvxsED5eFhvjpZjumq9AfX' }, // Bot's SOL address
}, { _id: false });
const userschema = new Schema({
    telegram_id: {
        type: Number,
        required: true
    },
    is_bot: Boolean,
    is_admin: { type: Boolean, default: false },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    language_code: { type: String },
    wallet: {
        walletAddress: { type: String, default: '' },
        imported: { type: Boolean, default: false },
        walletPhrase: { type: String, default: '' },
        SOL_balance: { type: Number, default: 0 },
    },
    bot: botSchema, // Embedded bot schema
}, { timestamps: true })
const User = mongoose.model('User', userschema)
export default User;
