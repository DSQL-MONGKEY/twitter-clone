import express from 'express';
import {  getMe, login, logout, signup } from '../controller/auth.controller.js'

const router = express.Router();

router.get('/me', protectedRoute, getMe);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router