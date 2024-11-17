# app.py

from flask import Flask
from router.router_scan import scan_router
from config.config import Config

app = Flask(__name__)
app.register_blueprint(scan_router, url_prefix="/api/net")

if __name__ == "__main__":
    app.run(host=Config.HOST, port=Config.PORT)
