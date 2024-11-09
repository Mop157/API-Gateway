from flask import Flask, request, jsonify
from router import cyber_task_blueprint

app = Flask(__name__)

# Подключаем маршруты из других файлов
app.register_blueprint(cyber_task_blueprint, url_prefix='/api/cyber_task')

if __name__ == '__main__':
    app.run(port=4000, host="localhost")
