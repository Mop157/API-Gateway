# app.py

from flask import Flask
from router.router_scan import scan_router
from config.config import HOST, PORT
from flask_cors import CORS

app = Flask(__name__)

cors = CORS(app, resources={
    r"/api/*": {
        "origins": "http://localhost:3000"
    }
})

app.register_blueprint(scan_router, url_prefix="/api/net")

if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=True)
