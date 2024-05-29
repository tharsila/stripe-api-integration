// src/routes.ts
import express, { Router } from 'express';
import UserController from '../controllers/user.controller';
import { UserService } from '@/services/user.service';
import { UserRepository } from '@/repositories/user.repository';
import { StripeService } from '@/services/stripe.service';


const router = Router();

const userRepository = new UserRepository();
const stripeService = new StripeService(userRepository);
const userService = new UserService(userRepository, stripeService);
const userController = new UserController(userService);

router.get('/users', userController.getAll.bind(userController));
router.get('/users/:id', userController.getById.bind(userController));
router.post('/users', userController.create.bind(userController));
router.put('/users/:id', userController.update.bind(userController));
router.delete('/users/:id', userController.delete.bind(userController));

export default router;
