import os
import hashlib
import time
import virustotal_python
from virustotal_python import VirustotalError
from dotenv import load_dotenv

load_dotenv()

class VirusTotalService:
    def __init__(self):
        self.api_key = os.getenv("VIRUSTOTAL_API_KEY")
        self.client = None
        if self.api_key and "your_" not in self.api_key:
            try:
                self.client = virustotal_python.Virustotal(API_KEY=self.api_key, API_VERSION=3)
            except Exception as e:
                print(f"VT Init Error: {e}")

    def calculate_hash(self, content: bytes) -> str:
        return hashlib.sha256(content).hexdigest()

    def scan_file(self, content: bytes, filename: str):
        if not self.client:
            return None

        file_hash = self.calculate_hash(content)
        
        # 1. Check Hash First (Fast)
        try:
            resp = self.client.request(f"files/{file_hash}")
            return self._parse_report(resp.data)
        except VirustotalError as e:
            if e.response.status_code == 404:
                return self._upload_and_poll(content, filename)
            return None
        except Exception as e:
            print(f"VT Scan Error: {e}")
            return None

    def _upload_and_poll(self, content: bytes, filename: str):
        try:
            print(f"Uploading {filename} to VirusTotal...")
            files = {"file": (filename, content)}
            resp = self.client.request("files", files=files, method="POST")
            
            # The response contains an Analysis ID
            analysis_id = resp.data.get("id")
            if not analysis_id:
                return None
            
            print(f"Analysis ID: {analysis_id}. Waiting for results...")
            return self._wait_for_analysis(analysis_id)
        except Exception as e:
            print(f"VT Upload Error: {e}")
            return None

    def _wait_for_analysis(self, analysis_id: str):
        # Poll up to 60 seconds
        for _ in range(30):
            try:
                resp = self.client.request(f"analyses/{analysis_id}")
                status = resp.data.get("attributes", {}).get("status")
                
                if status == "completed":
                    return self._parse_report(resp.data)
                
                time.sleep(2)
            except Exception as e:
                print(f"Polling Error: {e}")
                break
        
        return {
            "source": "VirusTotal",
            "risk_score": 50,
            "summary": "Analysis timed out. Please check VirusTotal dashboard.",
            "threats": ["Timeout"],
            "details": {}
        }

    def _parse_report(self, data):
        attr = data.get("attributes", {})
        stats = attr.get("stats") or attr.get("last_analysis_stats", {})
        
        malicious = stats.get("malicious", 0)
        suspicious = stats.get("suspicious", 0)
        
        # Get threat names
        results = attr.get("results") or attr.get("last_analysis_results", {})
        threats = []
        for engine, result in results.items():
            if result["category"] == "malicious":
                threats.append(f"{engine}: {result['result_name']}")
        
        return {
            "source": "VirusTotal",
            "risk_score": min((malicious + suspicious) * 10, 100),
            "summary": f"VirusTotal finished. Found {malicious} malicious engines.",
            "threats": threats[:5],
            "details": stats
        }

vt_service = VirusTotalService()
