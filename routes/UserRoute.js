import express from "express";
import {getUsers, getUserById, createUser, updateUser, deleteUser, getAllUser, userSeeders, register, login} from "../controllers/UserController.js"
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router()

router.get('/users', verifyToken, getUsers)
router.get('/users/:id', getUserById)
router.post('/users', createUser)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

router.get('/userSeeders', userSeeders)

router.get('/getAllUser', getAllUser);

router.post('/register', register)
router.post('/login', login)

export default router