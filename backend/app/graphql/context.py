import logging
from typing import Annotated, Any, TypeAlias, TypeGuard

import jwt
import strawberry.types
from fastapi import Depends
from pydantic import BaseModel
from starlette.requests import Request
from starlette.websockets import WebSocket
from strawberry.fastapi import BaseContext

from app import crud
from app.config import CONFIG
from app.db import DB
from app.graphql.access import AuthError
from app.graphql.dataloader import Loaders


class UserContext(BaseModel):
    user_id: str
    org_id: str | None = None


class UserOrganizationContext(BaseModel):
    user_id: str
    org_id: str


def has_org(ctx: UserContext | None) -> TypeGuard[UserOrganizationContext]:
    if ctx is None:
        return False

    if ctx.org_id is None:
        return False

    return True


class JWTVerifier:
    JWK_CLIENT = jwt.PyJWKClient(
        f"{CONFIG.CLERK_API_URL}/.well-known/jwks.json", cache_keys=True
    )

    @classmethod
    async def verify(cls, token: str) -> UserContext:
        key = cls.JWK_CLIENT.get_signing_key_from_jwt(token)

        try:
            payload = jwt.decode(token, key=key.key, algorithms=["RS256"])
        except Exception as e:
            logging.info(e)
            raise AuthError

        user_id = payload.get("sub")
        org_id = payload.get("org_id")

        if user_id is None or org_id is None:
            logging.debug(f"Missing user_id in {payload=}")
            raise AuthError

        logging.debug(f"Authenticated user {user_id=} {org_id=}")
        return UserContext(
            user_id=user_id,
            org_id=org_id,
        )


class Context(BaseContext):
    def __init__(self, user: UserContext | None, loaders: Loaders) -> None:
        self.user = user
        self.loaders = loaders


RootValueType: TypeAlias = None
Info = strawberry.types.Info[Context, RootValueType]


async def get_user(request: Request = None, websocket: WebSocket = None, connection_params: dict[str, Any] = None) -> UserContext | None:  # type: ignore
    jwt_token: str | None = None

    if request is not None:
        if request.headers.get("Authorization") is not None:
            jwt_token = request.headers["Authorization"].split(" ")[1]
        elif request.cookies.get("__session") is not None:
            jwt_token = request.cookies["__session"]
    elif websocket is not None:
        if websocket.headers.get("Authorization") is not None:
            jwt_token = websocket.headers["Authorization"].split(" ")[1]
        elif websocket.cookies.get("__session") is not None:
            jwt_token = websocket.cookies["__session"]
    elif (
        connection_params is not None and connection_params.get("authToken") is not None
    ):
        jwt_token = connection_params["authToken"]

    if jwt_token is None:
        return None

    return await JWTVerifier.verify(jwt_token)


async def get_context(
    user: Annotated[UserContext | None, Depends(get_user)],
) -> Context:
    if user is not None:
        async with DB.async_session() as db:
            logging.debug(f"Ensuring user {user.user_id} exists")
            await crud.ensure_user(db, user.user_id)
            logging.debug(f"Ensuring org {user.org_id} and {user.user_id} is a member")
            await crud.ensure_org_membership(db, user.user_id, user.org_id)
    return Context(
        user=user,
        loaders=Loaders(),
    )
