# controllers/scan_controller.py

from tools.net.nmap_tool import NmapTool
from tools.net.whois_tool import WhoisTool
from tools.net.ping_tool import PingTool
from utils.response_util import create_response

class ScanController:
    @staticmethod
    def perform_scan(ip_address=None, domain=None, scan_type="nmap"):
        try:
            if scan_type == "nmap" and ip_address:
                scan_result = NmapTool.run_scan(ip_address)
            elif scan_type == "whois" and domain:
                scan_result = WhoisTool.get_domain_info(domain)
            elif scan_type == "ping" and ip_address:
                scan_result = PingTool.ping(ip_address)
            else:
                raise ValueError("Invalid scan type or missing parameters")
                
            return create_response({"status": "success", "data": scan_result})
        except Exception as e:
            return create_response({"status": "error", "message": str(e)}, status=500)
