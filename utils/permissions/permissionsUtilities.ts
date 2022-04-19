export interface RouteInterface {
    get?: boolean,
    post?: boolean,
    patch?: boolean,
    delete?: boolean
}

export class Permission {

    public name: string = ''

    public routes: RouteInterface = {}

    constructor(name: string) {
        this.name = name
    }

    public getName (): string {
        return this.name
    }

    public setRoutes (routes: RouteInterface) {
        this.routes = routes
    }

    public getRoutes (): RouteInterface {
        return this.routes
    }

    public getMethodsAsArray (): string[] {
        return Object.entries(this.routes)
            .filter(([method, bool]) => bool)
            .map(([method, bool]) => method)
    }

}
