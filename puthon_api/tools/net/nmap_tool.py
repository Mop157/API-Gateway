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
                        
                        # Собираем расширенную информацию о каждом порте
                        results[host]["protocols"][proto][port] = {
                            "state": port_data['state'],           # Состояние порта (open/closed)
                            "service": port_data.get('name', ''),  # Название сервиса
                            "version": port_data.get('version', ''),  # Версия сервиса (если доступна)
                            "product": port_data.get('product', ''),  # Продукт (например, Apache)
                            "extrainfo": port_data.get('extrainfo', ''),  # Доп. информация о сервисе
                            "reason": port_data.get('reason', ''),  # Причина статуса (например, syn-ack)
                            "cpe": port_data.get('cpe', '')         # CPE (Common Platform Enumeration)
                        }
            return results
        except Exception as e:
            raise Exception(f"Nmap scan failed: {e}")
