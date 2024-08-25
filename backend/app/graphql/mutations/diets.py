from app import models
from app.db import DB
from app.graphql import context, schemas, utils
from app.graphql.access import AuthError
from app.optimizer import generate_diet
from sqlalchemy import func, select


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


async def update_diet_profiles(
    info: context.Info, input: "schemas.UpdateDietProfilesInput"
) -> "schemas.Diet":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        diet = await db.get(models.Diet, int(input.diet_id.node_id))

        if diet is None or diet.organization_id != info.context.user.org_id:
            raise Exception("Diet not found")

        current_configuration_version = (
            await db.scalar(
                select(func.max(models.DietConfigurationVersion.version)).where(
                    models.DietConfigurationVersion.diet_id == diet.id
                )
            )
            or 0
        )

        new_diet_configuration = models.DietConfigurationVersion(
            diet_id=diet.id,
            version=current_configuration_version + 1,
        )
        db.add(new_diet_configuration)
        await db.flush()

        merged_ids = set()

        for i, profile_id in enumerate(input.profile_ids):
            if profile_id.node_id in merged_ids:
                raise Exception(f"Duplicate profile id: {profile_id.node_id}")

            profile = await db.get(models.Profile, int(profile_id.node_id))

            if profile is None or (
                profile.organization_id != info.context.user.org_id
                and profile.organization_id is not None
            ):
                raise Exception("Profile not found")

            await db.merge(
                models.DietProfileConfiguration(
                    diet_id=diet.id,
                    profile_id=int(profile_id.node_id),
                    order=i,
                    configuration_version=new_diet_configuration.version,
                )
            )

        await db.commit()
        db.expunge_all()
        diet = await db.get(models.Diet, diet.id)

        if diet is None:
            raise Exception("Diet not found after update")

        return schemas.Diet.from_model(diet)


async def generate_diet_output(
    info: context.Info, input: "schemas.GenerateDietOutputInput"
) -> "schemas.DietOutputVersion":
    if not context.has_org(info.context.user):
        raise AuthError

    async with DB.async_session() as db:
        diet = await db.get(models.Diet, int(input.diet_id.node_id))

        if diet is None or diet.organization_id != info.context.user.org_id:
            raise Exception("Diet not found")

        diet_output_version = await generate_diet(db, diet)
        await db.commit()
        db.expunge_all()
        diet_output_version = await db.get(
            models.DietOutputVersion,
            (diet_output_version.diet_id, diet_output_version.version),
        )

        if diet_output_version is None:
            raise Exception("Diet output not found after generation")

        return schemas.DietOutputVersion.from_model(diet_output_version)
