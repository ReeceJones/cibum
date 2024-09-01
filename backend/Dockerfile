FROM python:3.11-bookworm as builder

RUN pip install poetry==1.8.3

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

RUN mkdir -p /app
WORKDIR /app

COPY poetry.lock pyproject.toml /app/

RUN --mount=type=cache,target=$POETRY_CACHE_DIR poetry install --without dev --no-root


FROM python:3.11-slim-bookworm as app

ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"

COPY --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}

WORKDIR /app
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

COPY main.py /app/main.py
COPY migrate_managed.py /app/migrate_managed.py
COPY data /app/data
COPY alembic.ini /app/alembic.ini
COPY alembic /app/alembic
COPY app /app/app

CMD ["sh", "start.sh"]