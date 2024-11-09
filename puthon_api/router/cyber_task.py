from flask import Blueprint, request, jsonify

cyber_task_blueprint = Blueprint('cyber_task', __name__)

@cyber_task_blueprint.route('/ol', methods=['POST'])
def cybersecurity_task():
    data = request.get_json()
    target = data.get("target")
    # Обработка задачи
    result = {"status": "success", "target": target, "info": "Task complete"}
    return jsonify(result)

@cyber_task_blueprint.route('/', methods=['GET'])
def cybersecurity_task1():
    # data = request.get_json()
    # target = data.get("target")
    # Обработка задачи
    result = {"status": "success", "info": "Task complete"}
    return jsonify("result")
