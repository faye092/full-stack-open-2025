import { test, describe, beforeEach, expect } from '@playwright/test'
import { loginWith, beforeEach } from './helper'
import userEvent from '@testing-library/user-event'

describe('Blog app', () => {
    beforeEach(async ({ page, request}) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                username: 'faye',
                name:'Fei Liao',
                password:'Fei1234'
            }
        })

        await page.goto('https://playwright.dev/')
    })

    test('login form is shown', async({ page }) => {
        await expect(page.getByText('Log in to application')).toBeVisible()
        await expect(page.getByText('username')).toBeVisible()
        await expect(page.getByText('password')).toBeVisible()
        await expect(page.getByRole('button', {name:'login'})).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async({ page }) => {
            await loginWith(page, 'faye', 'Fei1234')
            await expect(page.getByText('Fei Liao logged')).toBeVisible()
            await expect(page.getByRole('button', {name:'logout'})).toBeVisible()
        })

        test('login fails with wrong credentials', async( {page} ) => {
            await loginWith(page, 'faye', 'wrong')
            const errorDiv = await page.locator('.error')

            await expect(errorDiv).toContainText('invalid username or password')
            await expect(errorDiv).toHaveCSS('border-style', 'solid')
            await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
            await expect(
                page.getByText('Fei Liao logged in')
            ).not.toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({page}) => {
            await loginWith(page, 'faye', 'Fei1234')
        })

        test('a new blog can be created', async( {page}) => {
            await createBlog(page, 'blog-0', 'Fei', 'http://localhost:5173')

            await expect(
                page.getByText('a new blog-0 by Fei added')
            ).toBeVisible()
            await expect(
                page.getByRole('button', {name:'create new blog'})
            ).toBeVisible()
            await expect(page.getByRole('button', {name:'view'})).toBeVisible()
            await expect(page.getByText('blog-0 Fei')).toBeVisible()
        })

        describe('and several blogs exists', () => {
            beforeEach(async({page}) => {
                await createBlog(page, 'blog-1', 'Fei', 'http://localhost:5173')
                await createBlog(page, 'blog-2', 'Fei', 'http://localhost:5173')
                await createBlog(page, 'blog-3', 'Fei', 'http://localhost:5173')
            })

            test('the blog can be edited', async({page})=>{
                const blog = page.locator('.blog').filter({hasText:'blog-1'})
                await blog.getByRole('button', {name:'view'}).click()

                await expect(blog.getByText('likes 0')).toBeVisible()
                await blog.getByRole('button', {name:'like'}).click()

                await expect(blog.getByText('likes 1')).toBeVisible()
                await expect(blog.getByText('likes 0')).not.toBeVisible()
            })

            test('the user who added the blog can delete it', async({page}) => {
                const blog = page.locator('.blog').filter({hasText:'blog-2'})
                await blog.getByRole('button', {name:'view'}).click()
                await expect(blog.getByRole('button', {name:'remove'})).toBeVisible()

                page.on('dialog',async(dialog) => {
                    await dialog.accept()
                })
                await page.getByRole('button', {name:'remove'}).click()

                await expect(blog.getByRole('blog-2')).not.toBeVisible()
                await expect(blog).not.toBeVisible()
            })

            test('only the user who added the blog sees the remove button', async({
                page,
                request,
            }) => {
                const blog = page.locator('.blog').filter({hasText:'blog-3'})
                await blog.getByRole('button', {name:'view'}).click()
                await expect(blog.getByRole('button', {name:'remove'})).toBeVisible()

                await page.getByRole('button', {name:'logout'}).click()
                await request.post('/api/users', {
                    data:{
                        username:'test-user',
                        name:'Fei Liao',
                        password:'Fei1234',
                    }
                })
                await loginWith(page, 'test-user','Fei1234')
                await blog.getByRole('button',{name:'view'}).click()
                await expect(blog.getByRole('button', {name:'remove'})).not.toBeVisible()

            }) 
        })
    })
})