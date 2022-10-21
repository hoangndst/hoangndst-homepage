export interface RouteItem {
  title: string
  path?: string
  open?: boolean
  heading?: boolean
  sort?: boolean
  routes?: RouteItem[]
  summarize?: boolean
  new?: true
}

export interface Routes {
  routes: RouteItem[]
}

export interface Page {
  id: string
  html: string
  title: string
  toc?: any
}

export interface RouteContex {
  parent?: RouteItem
  prevRoute?: RouteItem
  nextRoute?: RouteItem
  route?: RouteItem
}

export const getAllRoutes = (routes: any) => {
  const allRoutes: RouteItem[] = []
  routes[0].routes.forEach((route: RouteItem) => {
    if (route.routes) {
      route.routes.forEach((item) => {
        allRoutes.push(item)
      })
    } else {
      allRoutes.push(route)
    }
  });
  return allRoutes
}

export const getRouteContex = (
  _route: RouteItem,
  routes: RouteItem[],
): RouteContex => {
  let ctx = {}
  if (!_route) return ctx
  const { path } = _route
  const allRoutes = getAllRoutes(routes)

  for (let i = 0; i < allRoutes.length; i += 1) {
    const route = allRoutes[i]
    if (route && route.path === path) {
      const nextRoute = allRoutes[i + 1]
      const prevRoute = allRoutes[i - 1]
      ctx = {
        nextRoute,
        prevRoute,
        route: _route
      }
    }
  }
  return ctx
}