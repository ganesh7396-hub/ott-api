import mongoose, { Document, Schema } from 'mongoose';

interface IMovie extends Document {
    title: string;
    genre: string;
    releaseYear: number;
    director: string;
    rating: number;
    streamingLink:string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

}

const MovieSchema: Schema = new Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    rating: { type: Number, required: true },
    releaseYear: { type: Number, required: true },
    streamingLink: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
    isActive: { type: Boolean, default: true },

});

const Movie = mongoose.model<IMovie>('Movies', MovieSchema);

export default Movie;
