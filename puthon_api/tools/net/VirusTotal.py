import virustotal_python
from virustotal_python import Virustotal
from config.config import Config
from base64 import urlsafe_b64encode

API_URL = 'https://www.virustotal.com/api/v3/urls'

def encode_url(url):
    return urlsafe_b64encode(url.encode()).decode().strip('=')

class VirusTotalTool:

    @staticmethod
    def scan_url(url):
        try:
            total = Virustotal(API_KEY=Config.api_key_virustul)
            
            response = total.request("urls", method="POST", data={"url": url})
            analysis_id = response.data["id"] 

            # print(f"URL отправлен на сканирование. ID анализа: {analysis_id}")
            
            result = total.request(f"analyses/{analysis_id}")
            return result.json()
        except virustotal_python.VirustotalError as e:
            print(f"Virustotal API error: {e}")
            raise Exception(f"Virustotal lookup failed: {e}")

