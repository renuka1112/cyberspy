import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model = None
        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-2.0-flash')
            except Exception as e:
                print(f"AI Service Error: {e}")

    async def analyze_text(self, text: str, filename: str):
        if not self.model:
            return self._mock_response()

        prompt = f"""
        Analyze the following file content for security threats.
        Filename: {filename}
        Content Snippet:
        {text[:8000]}
        
        Provide a strict JSON response (no markdown, no backticks) with this structure:
        {{
            "risk_score": (integer 0-100),
            "summary": "Brief executive summary of findings",
            "threats": ["list", "of", "specific", "threats"],
            "technical_details": {{
                "vulnerabilities": ["list"],
                "recommendation": "string"
            }}
        }}
        """
        try:
            response = self.model.generate_content(prompt)
            clean_text = response.text.replace('```json', '').replace('```', '').strip()
            return json.loads(clean_text)
        except Exception as e:
            print(f"Gemini Analysis Failed: {e}")
            return self._mock_response()

    def chat(self, message: str, context: str = ""):
        if not self.model:
            return "SIMBA (Offline): AI Core is not connected. Check API Key."
        
        try:
            prompt = f"""
            System Context: {context}
            User: {message}
            
            Act as SIMBA, a cybersecurity expert AI. Be concise, technical, and helpful.
            """
            res = self.model.generate_content(prompt)
            return res.text
        except Exception as e:
            return f"Error: {str(e)}"

    def _mock_response(self):
        return {
            "risk_score": 0,
            "summary": "AI Analysis Unavailable (Check API Key)",
            "threats": [],
            "technical_details": {}
        }

ai_service = AIService()
