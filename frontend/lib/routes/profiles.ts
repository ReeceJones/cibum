interface ProfileRouteParams {
  organizationSlug: string;
  profileId: string;
}

export function profileRoute(params: ProfileRouteParams) {
  return `/app/${params.organizationSlug}/profiles/${params.profileId}`;
}