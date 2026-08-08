---
name: markitdown
description: Converts various file formats (PDF, Word DOCX, Excel XLSX/XLS, PowerPoint PPTX, HTML, EPUB, Audio files, Images, CSV, JSON, YouTube transcripts) into Markdown using Microsoft MarkItDown CLI. Use this skill whenever converting or extracting text/content from documents, presentations, spreadsheets, or media into Markdown format.
---

# Microsoft MarkItDown Skill

Use `markitdown` CLI to parse and convert documents, spreadsheets, presentations, audio, HTML, and other file formats into clean Markdown.

## When to Use
- Whenever the user asks to parse, convert, extract, or read content from files like `.pdf`, `.docx`, `.xlsx`, `.xls`, `.pptx`, `.html`, `.epub`, `.wav`, `.mp3`, `.zip`, `.csv`, `.json`, or image files into Markdown.
- Whenever document processing requires converting formatted office documents or PDFs into Markdown for further indexing, summarizing, or analysis.

## Usage Commands

### 1. Basic Conversion
Convert a file and write to stdout or direct output file:
```powershell
markitdown path/to/document.pdf -o path/to/output.md
```

### 2. Convert to stdout
```powershell
markitdown path/to/document.docx
```

### 3. Hinting File Extension / MIME Type
```powershell
markitdown path/to/file -x pdf -o output.md
```

### 4. Python API Usage
```python
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("document.pptx")
print(result.text_content)
```
