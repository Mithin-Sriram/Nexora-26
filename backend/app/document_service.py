from pathlib import PurePath

import pymupdf
from fastapi import HTTPException, UploadFile

from app.config import settings


async def extract_document_text(file: UploadFile) -> tuple[str, str]:
    filename = PurePath(file.filename or "").name
    extension = PurePath(filename).suffix.lower()
    if extension not in {".pdf", ".txt"}:
        raise HTTPException(
            status_code=415, detail="Unsupported file type. Upload a PDF or TXT file."
        )

    content = await file.read(settings.max_upload_bytes + 1)
    if len(content) > settings.max_upload_bytes:
        raise HTTPException(
            status_code=413, detail="The uploaded file exceeds the 10 MB size limit."
        )
    if not content:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")

    if extension == ".txt":
        try:
            text = content.decode("utf-8-sig")
        except UnicodeDecodeError as exc:
            raise HTTPException(
                status_code=400, detail="The TXT file is not valid UTF-8 text."
            ) from exc
        if "\x00" in text:
            raise HTTPException(
                status_code=400, detail="The uploaded TXT file is not readable text."
            )
        document_name = filename or "document.txt"
    else:
        if not content.startswith(b"%PDF-"):
            raise HTTPException(
                status_code=400, detail="The uploaded file is not a valid PDF."
            )
        try:
            with pymupdf.open(stream=content, filetype="pdf") as document:
                if document.needs_pass:
                    raise HTTPException(
                        status_code=400,
                        detail="The uploaded PDF is password-protected and cannot be read.",
                    )
                text = "\n\n".join(page.get_text("text") for page in document)
        except HTTPException:
            raise
        except (pymupdf.FileDataError, RuntimeError, ValueError) as exc:
            raise HTTPException(
                status_code=400, detail="The uploaded PDF is unreadable or damaged."
            ) from exc
        document_name = filename or "document.pdf"

    if not text.strip():
        message = (
            "The uploaded PDF contains no extractable text."
            if extension == ".pdf"
            else "The uploaded TXT file contains no readable text."
        )
        raise HTTPException(status_code=400, detail=message)
    if len(text) > settings.max_text_characters:
        raise HTTPException(
            status_code=413,
            detail="The extracted document text exceeds the 50,000-character processing limit.",
        )
    return document_name, text
