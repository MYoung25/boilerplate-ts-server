import auth from './index'
import request from 'supertest'
import { router } from './index'

describe('Authentication', () => {

	describe('Session Store', () => {

		const useSpy = jest.spyOn(router, 'use')

		it('s', () => {
			expect(useSpy).toHaveBeenCalled()
		})

	})


})