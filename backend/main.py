import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CONFIG
from app.graphql.schemas import graphql_app

logging.basicConfig(level=logging.INFO)

app = FastAPI()
app.include_router(graphql_app, prefix="/graphql")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CONFIG.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
