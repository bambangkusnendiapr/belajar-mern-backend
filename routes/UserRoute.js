import express from "express";
import {getUsers, getUserById, createUser, updateUser, deleteUser, getAllUser, userSeeders} from "../controllers/UserController.js"

const router = express.Router()

router.get('/users', getUsers)
router.get('/users/:id', getUserById)
router.post('/users', createUser)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

router.get('/userSeeders', userSeeders)

router.get('/getAllUser', getAllUser);

export default router