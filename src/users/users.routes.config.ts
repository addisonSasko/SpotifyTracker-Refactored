import { CommonRoutesConfig } from "../common/common.routes.config";
import express from 'express'

export class UserRoutes extends CommonRoutesConfig {

    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }

    configureRoutes(): express.Application {
        throw this.app;
    }
}