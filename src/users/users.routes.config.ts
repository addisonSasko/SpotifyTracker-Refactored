import { CommonRoutesConfig } from "../common/common.routes.config";
import UsersController from "../users/controllers/users.controller"
import UsersMiddleware from "../users/middleware/users.middleware"
import express from 'express'

export class UserRoutes extends CommonRoutesConfig {

    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/users`)
            .get(UsersController.listUsers)
            .post(
                UsersMiddleware.validateRequiredUserBodyFields,
                UsersMiddleware.validateSameEmailDoesntExist,
                UsersController.createUser
            );

        this.app.param(`userId`, UsersMiddleware.extractUserId);
        this.app
            .route(`/users/:userId`)
            .all(UsersMiddleware.validateUserExists)
            .get(UsersController.getUserById)
            .delete(UsersController.removeUser);

        this.app.put(`/users/:userId`, [
            UsersMiddleware.validateRequiredUserBodyFields,
            UsersMiddleware.validateSameEmailBelongToSameUser,
            UsersController.put,
        ]);

        this.app.patch(`/users/:userId`, [
            UsersMiddleware.validatePatchEmail,
            UsersController.patch,
        ]);

        return this.app;
    }
}