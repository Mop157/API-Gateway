# router/api_router.py

from flask import Blueprint, request, jsonify

from tools.net.nmap_tool import NmapTool
from tools.net.whois_tool import WhoisTool
from tools.net.ping_tool import PingTool

from utils.response_util import create_response
from utils.Languages import Languages

# from controllers.scan_controller import ScanController

scan_router = Blueprint("api_router", __name__)

@scan_router.route("/Nmap/scan", methods=["POST"])
def scanNmap():
    try:
        data = request.json
        nmap = NmapTool.run_scan(data["ip"], data["range"], data["script"])
        response = create_response({"status": Languages["success"][request.json['Language']], "data": nmap})
        return jsonify(response[0]), response[1]
    except Exception as e:
        response = create_response({"status": Languages["error"][request.json['Language']], "message": str(e)}, status=500)
        return jsonify(response[0]), response[1]

@scan_router.route("/whois/scan", methods=["POST"])
def scanWhois():
    try:
        data = request.json
        whois = WhoisTool.get_domain_info(data["domain"])
        response = create_response({"status": Languages["success"][request.json['Language']], "data": whois})
        return jsonify(response[0]), response[1]
    except Exception as e:
        response = create_response({"status": Languages["error"][request.json['Language']], "message": str(e)}, status=500)
        return jsonify(response[0]), response[1]


@scan_router.route("/ping/scan", methods=["POST"])
def scanPing():
    try:
        data = request.json
        ping = PingTool.ping(data["ip"], data["number"])
        response = create_response({"status": Languages["success"][request.json['Language']], "data": ping})
        return jsonify(response[0]), response[1]
    except Exception as e:
        response = create_response({"status": Languages["error"][request.json['Language']], "message": str(e)}, status=500)
        return jsonify(response[0]), response[1]
    