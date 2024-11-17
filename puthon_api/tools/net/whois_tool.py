# tools/net/whois_tool.py

import whois as python_whois

class WhoisTool:
    @staticmethod
    def get_domain_info(domain):
        try:
            if domain.startswith('http://') or domain.startswith('https://'):
                domain = domain.split('//')[1]
            
            result = python_whois.whois(domain)
            return result
        except Exception as e:
            raise Exception(f"Whois lookup failed: {e}")
