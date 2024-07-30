from app.graphql import context
from strawberry.permission import BasePermission
from typing import Any


AuthException = Exception("User is not authenticated")


class IsAuthenticated(BasePermission):
    message = "User is not authenticated"

    def has_permission(self, source: Any, info: "context.Info", **kwargs: Any) -> bool:  # type: ignore
        return info.context.user is not None
    

class IsAuthenticatedWithOrganization(BasePermission):
    message = "User is not authenticated with an organization"

    def has_permission(self, source: Any, info: "context.Info", **kwargs: Any) -> bool:  # type: ignore
        return info.context.user is not None and info.context.user.org_id is not None


class WSIsAuthenticated(BasePermission):
    message = "User is not authenticated"

    async def has_permission(self, source: Any, info: "context.Info", **kwargs: Any) -> bool:  # type: ignore
        if info.context.connection_params is None:
            return False
        auth_token = info.context.connection_params.get("authToken")
        if auth_token is None:
            return False

        try:
            await context.JWTVerifier.verify(auth_token.split(" ")[1])
            return True
        except:
            return False