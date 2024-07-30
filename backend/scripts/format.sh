#!/bin/sh
source venv/bin/activate
python -m black - | python -m isort - | python -m autoflake --remove-all-unused-imports --remove-unused-variables --in-place -