import { superadmin, superadminPassword } from "../setup"
import request, { agent } from 'supertest'
import Express from 'express'

export async function getLoggedInSuperAdminAgent (app: Express.Application): Promise<request.SuperAgentTest> {
    const agent = request.agent(app) 
    await agent
        .post('/auth/login')
        .send(
            {
                email: superadmin.email,
                password: superadminPassword
            }
        )
    return agent 
}
