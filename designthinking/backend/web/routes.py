# web.routes
from flask import request, jsonify, abort, send_from_directory
import jwt
import os
from dotenv import load_dotenv
from functools import wraps
from flask_bcrypt import Bcrypt
from .models import Meeting
from sqlalchemy.exc import IntegrityError
from datetime import datetime, date, timedelta
from sqlalchemy import func, extract,desc,asc
import json
import traceback
import logging
# 检查环境
if os.environ.get('FLASK_ENV') == 'production':
    dotenv_path = '.env.production'
else:
    dotenv_path = '.env'
# 加载环境变量文件
load_dotenv(dotenv_path)

def configure_routes(app, db):
    bcrypt = Bcrypt(app)
    
    @app.route('/api/insertRecord', methods=['POST'])
    def insertRecord():
        data = request.get_json()
        mId = data['mId']
        hash1 = data['hash1']
        hash2 = data['hash2']
        
        new_record = Meeting(mId=mId, hash1=hash1, hash2=hash2)
        db.session.add(new_record)
        db.session.commit()

        return jsonify({"message": "Record inserted successfully"}), 200
        
    @app.route('/api/getHashByMId', methods=['GET'])
    def getHashByMId():
        mId = request.args.get('mId')
        record = Meeting.query.filter_by(mId=mId).first()

        if record:
            return jsonify({"hash1": record.hash1, "hash2": record.hash2}), 200
        else:
            return jsonify({"message": "No hash found for the given mId"}), 404
