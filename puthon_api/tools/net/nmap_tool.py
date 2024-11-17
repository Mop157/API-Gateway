# tools/net/nmap_tool.py

import subprocess
from config.config import Config

class NmapTool:
    @staticmethod
    def run_scan(ip_address):
        try:
            # Запуск сканирования Nmap с флагом -A для получения подробной информации
            result = subprocess.run(
                [Config.NMAP_PATH, "-A", ip_address],
                capture_output=True,
                text=True,
                check=True
            )
            return result.stdout  # Возвращаем результат сканирования
        except subprocess.CalledProcessError as e:
            raise Exception(f"Nmap scan failed: {e.stderr}")
