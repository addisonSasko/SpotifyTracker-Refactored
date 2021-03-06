import express from 'express';
import usersService from '../services/users.service';
import debug from 'debug'

const log: debug.IDebugger = debug('app:users-controller');
class UsersMiddleware {

    async validateRequiredUserBodyFields(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.email && req.body.password) {
            next();
        } else {
            res.status(400).send({
                error: `Missing required fields email and password`,
            })
        }
    }

    async validateSameEmailDoesntExist(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await usersService.getUserByEmail(req.body.email);
        if (user) {
            res.status(400).send({ error: `User email already exists` });
        } else {
            next();
        }
    }

    async validateSameEmailBelongToSameUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await usersService.getUserByEmail(req.body.email);
        if (user && user.id === req.params.userId) {
            next();
        } else {
            res.status(400).send({ error: `Invalid email`});
        }
    }

    // Here we need to use an arrow function to bind 'this' correctly
    validatePatchEmail = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (req.body.email) {
            log('Validating email', req.body.email);

            this.validateSameEmailBelongToSameUser(req, res, next);
        } else {
            next();
        }
    }

    async validateUserExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await usersService.readById(req.params.userId);
        if (user) {
            next();
        } else {
            res.status(404).send({
                error: `User ${req.params.userId} not found`,
            })
        }

    }

    // The idea here is to be able to sipmly user the full body request when we would like to 
    // update user information, without worrying about getting the ID from the parameters every time.
    // Instead, it's taken care of in just one spot, the middleware.
    async extractUserId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.userId;
        next();
    }
}

export default new UsersMiddleware();