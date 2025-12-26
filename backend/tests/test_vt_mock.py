
import asyncio
import sys
import os

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.virustotal_service import VirusTotalService
from unittest.mock import MagicMock, patch

async def test_clean_file_reporting():
    print("Testing Clean File Reporting...")
    
    # Mock the VirusTotal client response for a clean file
    mock_response = MagicMock()
    mock_response.data = {
        "attributes": {
            "status": "completed",
            "stats": {"malicious": 0, "suspicious": 0},
            "results": {},
            "last_analysis_stats": {"malicious": 0, "suspicious": 0},
            "last_analysis_results": {}
        }
    }

    # Initialize service with a fake key so it tries to use the client
    with patch.dict(os.environ, {"VIRUSTOTAL_API_KEY": "fake_key_for_test"}):
        service = VirusTotalService()
        # Inject mock client
        service.client = MagicMock()
        service.client.request.return_value = mock_response

        # Emulate scan_file behavior for a known hash
        # We'll mock calculate_hash to simple return "hash"
        service.calculate_hash = MagicMock(return_value="dummy_hash")
        
        # Test scan_file
        result = service.scan_file(b"content", "test.txt")
        
        print(f"Result: {result}")
        
        if result and result["risk_score"] == 0 and result["source"] == "VirusTotal":
            print("SUCCESS: Service returned zero risk score result from VirusTotal.")
        else:
            print("FAILURE: Service did not return expected zero risk score result.")

        # Now simulate the router logic:
        # The router code is:
        # vt_result = ...
        # if vt_result:
        #    return ...
        
        if result:
            print("SUCCESS: Router would return the VirusTotal result.")
        else:
            print("FAILURE: Router logic would skip this.")

if __name__ == "__main__":
    asyncio.run(test_clean_file_reporting())
