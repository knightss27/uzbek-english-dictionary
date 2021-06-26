import mongoose from 'mongoose';

/* schema stuff */
const { Schema } = mongoose;
const wordSchema = new Schema({
    uzbek_word: String,
    cyrillic_suggestion: String,
    grammatical_categories: [String],
    english_definitions: [{
        definition: String,
        form: String,
    }],
    examples: [{
        uzbek: String,
        english: String,
    }],
    section: String,
    related_words: [{
        item: String,
        refIndex: Number,
        href: String,
    }],
}, { collection: 'words' });
export const Word = mongoose.model('Word', wordSchema);

/* connection stuff */
const connection: any = {};
export const connectToDB = async () => {
    if (connection.isConnected) {
        return;
    }

    const db = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(db);
    connection.isConnected = db.connections[0].readyState;
    console.log(connection);
    return;
}