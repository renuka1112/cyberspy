from fastapi import APIRouter, UploadFile, File
from fastapi.concurrency import run_in_threadpool
from app.services.ai_service import ai_service
from app.services.pcap_service import pcap_service
from app.services.virustotal_service import vt_service

router = APIRouter()

@router.post("/file")
async def analyze_file(file: UploadFile = File(...)):
    content = await file.read()
    filename = file.filename
    
    # 1. Try VirusTotal (Run in threadpool to allow polling)
    vt_result = await run_in_threadpool(vt_service.scan_file, content, filename)
    
    if vt_result and vt_result.get("risk_score", 0) > 0:
        return {
            "filename": filename,
            "name": filename,
            "size": f"{len(content)/1024:.2f} KB",
            "type": file.content_type,
            "score": vt_result["risk_score"],
            "risk_score": vt_result["risk_score"],
            "summary": vt_result["summary"],
            "threats": vt_result["threats"],
            "technical_details": vt_result["details"],
            "source": "VirusTotal"
        }

    # 2. Fallback to Gemini
    try:
        text_content = content.decode('utf-8')
        ai_result = await ai_service.analyze_text(text_content, filename)
        
        return {
            "filename": filename,
            "name": filename,
            "size": f"{len(content)/1024:.2f} KB",
            "type": file.content_type,
            "score": ai_result.get("risk_score", 0),
            **ai_result,
            "source": "Gemini AI"
        }
    except UnicodeDecodeError:
        return {
            "filename": filename,
            "name": filename,
            "size": f"{len(content)/1024:.2f} KB",
            "type": "Binary",
            "score": 0,
            "risk_score": 0,
            "summary": "Clean binary file (No VirusTotal matches).",
            "threats": [],
            "technical_details": {},
            "source": "VirusTotal (Clean)"
        }

@router.post("/pcap")
async def analyze_pcap(file: UploadFile = File(...)):
    return pcap_service.analyze(file.file, file.filename)