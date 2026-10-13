import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


def _get_port() -> int:
    try:
        port = int(os.getenv("PORT", "8000"))
    except ValueError as exc:
        raise RuntimeError("PORT must be a valid integer.") from exc
    if not 1 <= port <= 65535:
        raise RuntimeError("PORT must be between 1 and 65535.")
    return port


@dataclass(frozen=True)
class Settings:
    host: str
    port: int
    cors_origins: list[str]
    openrouter_api_key: str
    openrouter_model: str
    max_upload_bytes: int = 10 * 1024 * 1024
    max_text_characters: int = 50_000


settings = Settings(
    host=os.getenv("HOST", "0.0.0.0"),
    port=_get_port(),
    cors_origins=[
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
        if origin.strip()
    ],
    openrouter_api_key=os.getenv("OPENROUTER_API_KEY", "").strip(),
    openrouter_model=os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini").strip(),
)
