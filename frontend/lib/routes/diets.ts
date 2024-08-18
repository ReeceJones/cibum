interface DietRouteParams {
  organizationSlug: string;
  dietId: string;
}

export function dietRoute(params: DietRouteParams) {
  return `/app/${params.organizationSlug}/diets/${params.dietId}`;
}
