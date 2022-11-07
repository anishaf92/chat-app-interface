import os

from flask_socketio import SocketIO, emit
from flask import Flask, render_template, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin

app = Flask(__name__)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URI")
db = SQLAlchemy(app)
app.config['SECRET_KEY'] = 'mysecret'
app.host = "http://localhost:3000"
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")


class User(db.Model):
    userName = db.Column(db.String(200))
    email = db.Column(db.String(200))
    uid = db.Column(db.String(200), primary_key=True)
    isOnline = db.Column(db.Integer)


def to_json(self):
    return {
        'userName': self.userName,
        'email': self.email,
        'uid': self.uid,
        'isOnline': self.isOnline

    }


@app.route('/add', methods=['POST'])
@cross_origin()
def create():
    user = User()
    json_data = request.get_json(force=True)
    user.userName = json_data['userName']
    user.email = json_data['email']
    user.uid = json_data['uid']
    user.isOnline = json_data['isOnline']

    db.session.add(user)
    db.session.commit()
    return "Record added"


@app.route('/', methods=['GET'])
def home():
    data = []
    user_list = User.query.filter_by(isOnline=1)

    for user in user_list:
        data.append(user.email)

    return jsonify(data)


@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    print(request.sid)
    print("client has connected")
    emit("connect", {"data": f"id: {request.sid} is connected"})


@socketio.on('message')
def handle_message(message):
    """event listener when client types a message"""
    print("data from the front end: ", str(message))
    emit("data", {'message': message, 'id': request.sid}, broadcast=True)


@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print("user disconnected")
    emit("disconnect", f"user {request.sid} disconnected", broadcast=True)


if __name__ == "__main__":
    app.run(debug=True)
