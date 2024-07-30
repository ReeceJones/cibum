from pydantic_settings import BaseSettings


class Config(BaseSettings):
    model_config = {"env_file": ".env.local"}

    DB_URI: str = "postgresql+asyncpg://cibum:cibum@infra-postgresql.default/cibum"
    REDIS_URI: str = "redis://:cibum@infra-redis-master.default:6379/0"
    TESTING: bool = False
    ECHO_SQL: bool = False
    CLERK_API_URL: str
    CLERK_SECRET_KEY: str
    FRONTEND_URLS: str = "http://localhost:3000"

    @property
    def CORS_ORIGINS(self) -> list[str]:
        return self.FRONTEND_URLS.split(",")


CONFIG = Config()  # type: ignore
