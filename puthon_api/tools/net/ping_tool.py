# tools/net/ping_tool.py

import subprocess

class PingTool:
    @staticmethod
    def ping(ip_address):
        try:
            result = subprocess.run(
                ["ping", "-n", "4", ip_address],
                capture_output=True,
                text=True,
                check=True
            )
            return result.stdout
        except subprocess.CalledProcessError as e:
            raise Exception(f"Ping failed: {e.stderr}")
