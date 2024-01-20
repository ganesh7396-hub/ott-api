import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Users from "../models/Users";
import express from "express";
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwtUtils';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userName, email, password, roleType } = req.body;

  const user = new Users({
    _id: new mongoose.Types.ObjectId(),
    userName,
    email,
    password,
    roleType
  });

  user
    .save()
    .then((userobj) => {
      res.status(201).json({ userobj });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;
  console.log(userId, "userId");
  const userData = await Users.findById({ _id: userId });
  if (!userData) {
    res.status(404).json({ message: "not found" });
  } else {
    res.status(200).json({ data: userData });
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const usersData = await Users.find();
  if (!usersData) {
    res.status(500).json({ message: "not found" });
  } else {
    res.status(200).json({ data: usersData });
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;
  const reqObj = req.body;
  const usersData = await Users.updateOne({ _id: userId }, { $set: reqObj });
  if (!usersData) {
    res.status(500).json({ message: "not found" });
  } else {
    res.status(200).json({ data: usersData });
  }
};

const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;

  return Users.findByIdAndDelete({ _id: userId })
    .then((user) =>
      user
        ? res.status(201).json({ user, message: "Deleted" })
        : res.status(404).json({ message: "not found" })
    )
    .catch((error) => res.status(500).json({ error }));
};




const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { userName, password } = req.body;
  try {
    const user = await Users.findOne({ userName });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.status(200).json({ "token": token, data: user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createUser, getUser, getAllUsers, updateUser, deleteUser,
  userLogin
};
