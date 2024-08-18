from typing import (Callable, Iterable, Optional, Type, TypeGuard, TypeVar,
                    Union)

import strawberry
from strawberry import relay
from strawberry.types import unset

T = TypeVar("T")
K = TypeVar("K")
Q = TypeVar("Q")


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


def make_relay_result(
    nodes: Iterable[T],
    models: Iterable[K],
    required: bool,
    key: Callable[[K], T],
    conv: Callable[[K], Q],
) -> list[Optional[Q]]:
    """
    Convert a list of models to a list of relay compatible results
    @param nodes: List of node IDs
    @param models: List of models
    @param required: Whether all nodes must be found
    @param key: Function to get the node id of a model
    @param conv: Function to convert a model to a schema object
    """

    results: list[Optional[Q]] = []
    models_dict: dict[T, K] = {key(x): x for x in models}

    for node in nodes:
        if (model := models_dict.get(node)) is not None:
            results.append(conv(model))
        else:
            if required:
                raise Exception(f"Model with ID {node} not found")
            results.append(None)

    return results
