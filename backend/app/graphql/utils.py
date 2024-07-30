from typing import Type, TypeGuard, TypeVar, Union

import strawberry
from strawberry import relay
from strawberry.types import unset

T = TypeVar("T")


def strawberry_id(id: str | int) -> strawberry.ID:
    return strawberry.ID(str(id))


def global_id(type: str | Type[relay.Node], id: str | int) -> relay.GlobalID:
    if not isinstance(type, str):
        type_name = type.__name__
    else:
        type_name = type
    return relay.GlobalID(type_name, str(id))


def is_set(value: Union[T, unset.UnsetType, None]) -> TypeGuard[T | None]:
    """
    Check if a value is set
    """
    return value is not strawberry.UNSET


def is_value(value: Union[T, unset.UnsetType, None]) -> TypeGuard[T]:
    """
    Check if a value is set and not None
    """
    return value is not strawberry.UNSET and value is not None
