import express from 'express'
import { createCategoryController, deleteCategoryController } from '../controllers/categoryController.js'

const router = express.Router()
router.post('/createCategory', createCategoryController)
//LOGIN/post
router.post('/deleteCategory', deleteCategoryController)
export default router