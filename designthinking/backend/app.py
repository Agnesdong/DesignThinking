from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv
from web.routes import configure_routes
from web.database import db  # Import the db object
import pymysql

pymysql.install_as_MySQLdb()

load_dotenv()

DB_USER = os.getenv('MYSQL_USER')
DB_PASSWORD = os.getenv('MYSQL_PASSWORD')
DB_HOST = os.getenv('MYSQL_HOST', '127.0.0.1')
DB_PORT = int(os.getenv('MYSQL_PORT', 3306))  # Convert to int
DB_NAME = os.getenv('MYSQL_DB')

app = Flask(__name__, static_folder='public')
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable event system

CORS(app)
db.init_app(app)
configure_routes(app, db)
