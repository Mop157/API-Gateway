# utils/response_util.py

def create_response(data, status=200):
    return {"status": data.get("status"), "data": data.get("data", None), "message": data.get("message", None)}, status
