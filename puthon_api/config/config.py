from dotenv import load_dotenv
import os

load_dotenv()

HOST = os.getenv('HOST')
PORT = os.getenv("PORT")
api_key_virustul = os.getenv('API_KEY_VIRUSTUL')