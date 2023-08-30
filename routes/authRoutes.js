import express from 'express'
import { deleteUserController, loginController, registerController } from '../controllers/authController.js'
const router = express.Router()
router.post('/register', registerController)
//LOGIN/post
router.post('/login', loginController)
router.post('/deleteUser', deleteUserController)

export default router