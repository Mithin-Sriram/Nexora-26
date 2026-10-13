import asyncio
import os
import subprocess
from pathlib import Path

from fastapi import HTTPException

BACKEND_DIR = Path(__file__).resolve().parents[1]
ENGINE_DIR = BACKEND_DIR / "vendor" / "espeak"
ENGINE_PATH = ENGINE_DIR / "usr" / "bin" / "espeak-ng"
DATA_PATH = ENGINE_DIR / "usr" / "lib" / "x86_64-linux-gnu" / "espeak-ng-data"
LIBRARY_PATH = ENGINE_DIR / "usr" / "lib" / "x86_64-linux-gnu"


def _synthesize(text: str) -> bytes:
    if not ENGINE_PATH.is_file() or not DATA_PATH.is_dir():
        raise HTTPException(
            status_code=503,
            detail="The local speech engine is missing. Reinstall the backend speech runtime.",
        )

    environment = os.environ.copy()
    environment["ESPEAK_DATA_PATH"] = str(DATA_PATH)
    existing_library_path = environment.get("LD_LIBRARY_PATH")
    environment["LD_LIBRARY_PATH"] = (
        f"{LIBRARY_PATH}:{existing_library_path}"
        if existing_library_path
        else str(LIBRARY_PATH)
    )

    try:
        result = subprocess.run(
            [
                str(ENGINE_PATH),
                "-v",
                "en-us",
                "-s",
                "150",
                "--stdout",
                "--stdin",
            ],
            input=text.encode("utf-8"),
            capture_output=True,
            timeout=60,
            check=False,
            env=environment,
        )
    except subprocess.TimeoutExpired as exc:
        raise HTTPException(
            status_code=504,
            detail="Local speech generation took too long. Try a shorter passage.",
        ) from exc
    except OSError as exc:
        raise HTTPException(
            status_code=503,
            detail="The local speech engine could not start on this system.",
        ) from exc

    if result.returncode != 0 or not result.stdout.startswith(b"RIFF"):
        raise HTTPException(
            status_code=503,
            detail="Local speech generation failed. Check the backend speech runtime installation.",
        )
    return result.stdout


async def synthesize_speech(text: str) -> bytes:
    return await asyncio.to_thread(_synthesize, text)
