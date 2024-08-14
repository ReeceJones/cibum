interface OrganizationRouteParams {
  slug: string;
}

export function organizationRoute(params: OrganizationRouteParams): string {
  return `/app/${params.slug}`;
}

export function organizationNutritionRoute(params: OrganizationRouteParams): string {
  return `/app/${params.slug}/nutrients`;
}

export function organizationIngredientsRoute(params: OrganizationRouteParams): string {
  return `/app/${params.slug}/ingredients`;
}

export function organizationProfilesRoute(params: OrganizationRouteParams): string {
  return `/app/${params.slug}/profiles`;
}

export function organizationDietsRoute(params: OrganizationRouteParams): string {
  return `/app/${params.slug}/diets`;
}
