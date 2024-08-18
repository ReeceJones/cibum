from app import models
from app.db import DB
from app.graphql import context, schemas, utils
from app.graphql.access import AuthError


async def create_diet(
    info: context.Info, input: "schemas.CreateDietInput"
) -> "schemas.Diet":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        diet = models.Diet(
            organization_id=info.context.user.org_id,
            name=input.name,
            description=input.description,
        )
        db.add(diet)
        await db.commit()

        return schemas.Diet.from_model(diet)


async def update_diet(
    info: context.Info, input: "schemas.UpdateDietInput"
) -> "schemas.Diet":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        diet = await db.get(models.Diet, int(input.id.node_id))

        if diet is None or diet.organization_id != info.context.user.org_id:
            raise Exception("Diet not found")

        if utils.is_set(input.name):
            if input.name is None:
                raise Exception("Name is required for Diet")
            diet.name = input.name

        if utils.is_set(input.description):
            diet.description = input.description

        await db.commit()

        return schemas.Diet.from_model(diet)


async def delete_diet(
    info: context.Info, input: "schemas.DeleteNodeInput"
) -> "schemas.DeletedNode":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        for id in input.ids:
            diet = await db.get(models.Diet, int(id.node_id))

            if diet is None or diet.organization_id != info.context.user.org_id:
                raise Exception("Diet not found")

            diet.archived = True
        await db.commit()

        return schemas.DeletedNode(success=True)
