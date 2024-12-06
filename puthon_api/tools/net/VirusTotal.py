import virustotal_python
from virustotal_python import Virustotal
from base64 import urlsafe_b64encode
from config.config import api_key_virustul

API_URL = 'https://www.virustotal.com/api/v3/urls'

def encode_url(url):
    return urlsafe_b64encode(url.encode()).decode().strip('=')

class VirusTotalTool:

    @staticmethod
    def scan_url(url):
        try:
            total = Virustotal(API_KEY=api_key_virustul)
            
            response = total.request("urls", method="POST", data={"url": url})
            analysis_id = response.data["id"] 
            
            result = total.request(f"analyses/{analysis_id}")
            return result.json()
        except virustotal_python.VirustotalError as e:
            print(f"Virustotal API error: {e}")
            raise Exception(f"Virustotal lookup failed: {e}")

