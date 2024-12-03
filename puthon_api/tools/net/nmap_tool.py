# tools/net/nmap_tool.py

import nmap

class NmapTool:
    @staticmethod
    def run_scan(ip_address, range, script):
        try:
            results = {}
            scanner = nmap.PortScanner()
            
            
            scanner.scan(ip_address, range, script)
            
            for host in scanner.all_hosts():
                results[host] = {
                    "hostname": scanner[host].hostname(),
                    "state": scanner[host].state(),
                    "protocols": {}
                }
                
                for proto in scanner[host].all_protocols():
                    results[host]["protocols"][proto] = {}
                    ports = scanner[host][proto].keys()
                    
                    for port in sorted(ports):
                        port_data = scanner[host][proto][port]
                        
                        results[host]["protocols"][proto][port] = {
                            "state": port_data['state'],           
                            "service": port_data.get('name', ''),  
                            "version": port_data.get('version', ''),  
                            "product": port_data.get('product', ''),  
                            "extrainfo": port_data.get('extrainfo', ''), 
                            "reason": port_data.get('reason', ''),  
                            "cpe": port_data.get('cpe', '')         
                        }
            return results
        except Exception as e:
            raise Exception(f"Nmap ПОМИЛКА: {e}")
