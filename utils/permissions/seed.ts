import fs from 'fs'
import path from 'path'
import { Permission, RouteInterface } from "./permissionsUtilities"
import { establishMongooseConnection } from "../../src/mongodb"
import { Permissions as PermissionModel } from "../../src/entities/Permissions"

// @ts-ignore
fs.readdir('./src/routes/', async (err, files) => {
    const permissionsRoutes = files.filter((file: string) => (
        !file.includes('test') && file.includes('.ts') && file !== 'index.ts'
    ))

    const permissionsList: Permission[] = []
    await Promise.all(permissionsRoutes.map(async module => {
        import(path.resolve(__dirname, `../../src/routes/${module}`))
            .then(router => {
                let moduleCommonNamePlural = module.replace('.ts', '')
                let moduleCommonNameSingular = moduleCommonNamePlural.replace(/s$/, '')
                const collectionRoute = new Permission(moduleCommonNamePlural)
                const itemRoute = new Permission(moduleCommonNameSingular)

                router.default.stack.forEach((layer: {
                    route: {
                        path: string,
                        stack: any[],
                        methods: RouteInterface
                    }
                }) => {
                    switch (layer.route.path) {
                        case '/':
                            collectionRoute.setRoutes(layer.route.methods)
                            break
                        case '/:id':
                            itemRoute.setRoutes(layer.route.methods)
                            break
                    }
                })
                permissionsList.push(collectionRoute)
                permissionsList.push(itemRoute)
            })
    }))

    try {
        await establishMongooseConnection()
    } catch (e: any) {
        console.error(e?.message)
        process.exit(1)
    }

    await Promise.all(permissionsList.map(async (permission: Permission): Promise<any> => {
        const mappedPermissionsStrings = permission
            .getMethodsAsArray()
            .map(method => `${permission.getName().toLowerCase()}.${method}`)
        return Promise.all(mappedPermissionsStrings.map(permissionString => {
            return PermissionModel.updateOne(
                {name: permissionString},
                {name: permissionString, group: permission.getPlurifiedName() },
                {upsert: true}
            )
        }))
    }))

    process.exit()
})
