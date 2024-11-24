# tools/net/ping_tool.py

import subprocess

class PingTool:
    @staticmethod
    def ping(ip_address, number):
        try:
            result = subprocess.run(
                ["ping", "-n", str(number), ip_address],
                capture_output=True,
                text=True,
                check=True
            )
            return result.stdout
        except subprocess.CalledProcessError as e:
            raise Exception(f"Ping failed: {e.stderr}")
        except Exception as e:
            print(f"Произошла ошибка: {e}")
