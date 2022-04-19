import fs from 'fs'
import path from 'path'

// @ts-ignore
fs.readdir('./src/routes/', async (err, files) => {
    const permissionsRoutes = files.filter((file: string) => (
        !file.includes('test') && file.includes('.ts') && file !== 'index.ts'
    ))

    await Promise.all(permissionsRoutes.map(async module => {
        import(path.resolve(__dirname, `../../src/routes/${module}`))
            .then(router => {
                console.log(router.default.stack)
            })
    }))


    // process.exit()
})
