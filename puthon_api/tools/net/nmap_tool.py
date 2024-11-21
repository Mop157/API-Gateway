# tools/net/nmap_tool.py

import nmap

class NmapTool:
    @staticmethod
    def run_scan(ip_address):
        try:
            results = {}
            result = nmap.PortScanner()
            result.scan(ip_address, "22-443")
            for host in result.all_hosts():
                results[host] = {
                    "hostname": result[host].hostname(),
                    "state": result[host].state(),
                    "protocols": {}
                    }
                for proto in result[host].all_protocols():
                    results[host]["protocols"][proto] = {}
                    lport = result[host][proto].keys()
                    for port in lport:
                        results[host]["protocols"][proto][port] = result[host][proto][port]['state']
            return results
        except Exception as e:
            raise Exception(f"Nmap scan failed: {e}")
