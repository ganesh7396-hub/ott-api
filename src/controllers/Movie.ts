import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Users from "../models/Users";
import Movie from "../models/Movies";
import express from "express";
import bcrypt from 'bcrypt';
import { generateToken,authenticateToken } from '../utils/jwtUtils';

const addMovie = async (req: Request, res: Response, next: NextFunction) => {
  if(req.body.user.roleType === "admin"){
  const { title, genre, releaseYear,director,streamingLink,rating} = req.body;

  const movie = new Movie({
    _id: new mongoose.Types.ObjectId(),
    title,
    genre,
    releaseYear,
    director,
    streamingLink,
    rating
  });

  movie
    .save()
    .then((movie) => {
      res.status(201).json({ movie });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });

  }else{
    res.status(500).json({message:"User don't have Permission" })
  }

};


const getAllMovies = async (req: Request, res: Response, next: NextFunction) => {
  const movieData = await Movie.find();
  if (!movieData) {
    res.status(500).json({ message: "not found" });
  } else {
    res.status(200).json({ data: movieData });
  }
};

const searchMovie = async (req: Request, res: Response, next: NextFunction) => {

  
    const { q } = req.query;
        if (!q) {
                return res.status(400).json({ error: 'Invalid or missing query parameter' });
        }
    const regex = new RegExp(String(q), 'i');
    const movieData = await Movie.find({$or:[{title:regex},{genre:regex}]});

    if (!movieData || movieData.length === 0) {
      return res.status(404).json({ message: 'Movies not found' });
    }

    res.status(200).json({ data: movieData });
  };





const updateMovie = async (req: Request, res: Response, next: NextFunction) => {

  if(req.body.user.roleType === "admin"){
  const mId = req.params.mId;
  const reqObj = req.body;
  const movieData = await Movie.updateOne({ _id: mId }, { $set: reqObj });
  if (!movieData) {
    res.status(500).json({ message: "not found" });
  } else {
    res.status(200).json({ data: movieData });
  }
}else{
  res.status(500).json({message:"User don't have Permission" })
}
};

const deleteMovie = (req: Request, res: Response, next: NextFunction) => {

  if(req.body.user.roleType === "admin"){
  const mId = req.params.mId;

  return Movie.findByIdAndDelete({ _id: mId })
    .then((movie) =>
    movie
        ? res.status(201).json({ movie, message: "Deleted" })
        : res.status(404).json({ message: "not found" })
    )
    .catch((error) => res.status(500).json({ error }));
  }else{
    res.status(500).json({message:"User don't have Permission" })
  }
};






export default { addMovie, getAllMovies,searchMovie, updateMovie, deleteMovie,
   };
