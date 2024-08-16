#!/bin/sh

# venv path is in the parent directory of this script
VENV_PATH=$(dirname $(dirname $(realpath $0)))/venv
source $VENV_PATH/bin/activate
python -m black - | python -m isort - | python -m autoflake --remove-all-unused-imports --remove-unused-variables --in-place -