import json
from datetime import datetime

from flask import Flask, request, Response
from  flask_cors import CORS

from database import db_connect

app = Flask(__name__)
CORS(app)


@app.route("/login/<type>", methods=['POST'])
def login(type):
    try:
        body = json.loads(request.data)
        username = body.get('username')
        password = body.get('password')

        if not username or not password:
            response = json.dumps(
                {'response': 'Username and password are Required!'})
            return Response(response, status=422, mimetype='application/json')

        database = db_connect()
        cursor = database.cursor(buffered=True)

        cursor.execute(
            f"SELECT * FROM users where username=%s AND password=%s", (username, password))
        user = cursor.fetchone()

        if not user:
            response = json.dumps({'response': "Wrong username or password!"})
            return Response(response, status=422, mimetype='application/json')

        if type == 'owner' and not user[4]:
            response = json.dumps({'response': "No access!"})
            return Response(response, status=422, mimetype='application/json')

        cursor.close()
        database.close()

        response = {
            'data': {
                'id': user[0],
                'name': user[1],
                'username': user[2],
            }
        }
        response = json.dumps(response)

        return Response(response, status=200, mimetype='application/json')
    except Exception as err:
        response = json.dumps({'response': "Something went wrong!"})
        return Response(response, status=500, mimetype='application/json')


@app.route("/register", methods=['POST'])
def register():
    try:
        database = db_connect()
        cursor = database.cursor(buffered=True)

        body = json.loads(request.data)

        name = body.get('name')
        username = body.get('username')
        password = body.get('password')

        if not name or not username or not password:
            response = json.dumps(
                {'response': 'Name, username and passoword is required!'})
            return Response(response, status=422, mimetype='application/json')

        cursor.execute("SELECT * FROM users where username=%s", (username,))
        user = cursor.fetchone()

        if user:
            response = json.dumps({'response': "Username is already taken!"})
            return Response(response, status=422, mimetype='application/json')
        cursor.execute(
            f"INSERT INTO users VALUES (%s, %s, %s, %s, %s)", (None, name, username, password, 0))

        database.commit()
        cursor.close()
        database.close()

        response = json.dumps({'response': "User registered!"})
        return Response(response, status=200, mimetype='application/json')
    except Exception as err:
        response = json.dumps({'response': "Something went wrong!"})
        return Response(response, status=500, mimetype='application/json')


@app.route("/properties/<owner_id>", methods=['POST'])
def add_property(owner_id):
    try:
        body = json.loads(request.data)

        name = body.get('name')
        location = body.get('location')
        rent_amount = body.get('rent_amount')
        advance_amount = body.get('advance_amount')

        if not name or not location or not rent_amount or not advance_amount:
            response = json.dumps(
                {'response': 'Name, location, rent amount, advance amount is required!'})
            return Response(response, status=422, mimetype='application/json')

        database = db_connect()
        cursor = database.cursor(buffered=True)

        cursor.execute(
            f"SELECT * FROM users where id = %s AND is_owner = %s", (owner_id, 1))
        user = cursor.fetchone()

        if not user:
            response = json.dumps(
                {'response': 'Invalid Owner Id!'})
            return Response(response, status=422, mimetype='application/json')

        cursor.execute(
            f"INSERT INTO properties VALUES (%s, %s, %s, %s, %s, %s, %s)", (None, name, location, rent_amount, advance_amount, 1, owner_id))

        database.commit()
        cursor.close()
        database.close()

        response = json.dumps({'response': "Property registered!"})
        return Response(response, status=200, mimetype='application/json')
    except Exception as err:
        response = json.dumps({'response': "Something went wrong!"})
        return Response(response, status=500, mimetype='application/json')


@app.route("/properties", methods=['GET'])
def get_properties():
    try:
        params = request.args.to_dict()
        owner_id = params.get('owner_id')

        database = db_connect()
        cursor = database.cursor(buffered=True)

        if owner_id:
            cursor.execute(
                "SELECT * FROM properties WHERE owner_id = %s", [owner_id])
        else:
            cursor.execute("SELECT * FROM properties")

        properties = cursor.fetchall()

        for idx, property in enumerate(properties):
            properties[idx] = {
                'id': property[0],
                'name': property[1],
                'location': property[2],
                'rental_amount': property[3],
                'advance_amount': property[4],
                'availability': property[5],
            }

        cursor.close()
        database.close()

        response = json.dumps({'data': properties})
        return Response(response, status=200, mimetype='application/json')
    except Exception as err:
        response = json.dumps({'response': "Something went wrong!"})
        return Response(response, status=500, mimetype='application/json')


@app.route("/properties/<id>", methods=['PUT'])
def update_property(id):
    try:
        body = json.loads(request.data)

        name = body.get('name')
        location = body.get('location')
        rent_amount = body.get('rent_amount')
        advance_amount = body.get('advance_amount')

        if not name or not location or not rent_amount or not advance_amount:
            response = json.dumps(
                {'response': 'Name, location, rent amount, advance amount is required!'})
            return Response(response, status=422, mimetype='application/json')

        database = db_connect()
        cursor = database.cursor(buffered=True)

        cursor.execute(
            f"UPDATE properties SET name = %s, location = %s, rent_amount = %s, advance_amount = %s WHERE id = %s",
            (name, location, rent_amount, advance_amount, id))

        database.commit()
        cursor.close()
        database.close()

        response = json.dumps({'response': "Property updated!"})
        return Response(response, status=200, mimetype='application/json')
    except Exception as err:
        response = json.dumps({'response': "Something went wrong!"})
        return Response(response, status=500, mimetype='application/json')


@app.route("/properties/<id>", methods=['DELETE'])
def delete_property(id):
    try:
        database = db_connect()
        cursor = database.cursor(buffered=True)

        cursor.execute(
            "DELETE FROM properties WHERE id = %s", [id])

        database.commit()
        cursor.close()
        database.close()

        response = json.dumps({'response': 'Propery deleted!'})
        return Response(response, status=200, mimetype='application/json')
    except Exception as err:
        response = json.dumps({'response': "Something went wrong!"})
        return Response(response, status=500, mimetype='application/json')


@app.route("/property/book/<type>/<id>", methods=['GET'])
def get_property_bookings(type, id):
    try:
        database = db_connect()
        cursor = database.cursor(buffered=True)

        if type == 'owner':
            cursor.execute(
                """SELECT br.*, u.name as user_name FROM (SELECT b.*, p.name FROM bookings b RIGHT JOIN (SELECT id, name FROM properties WHERE owner_id = %s) p 
                ON p.id = b.property_id) br LEFT JOIN users u ON u.id = br.user_id""", [id])

            bookings = cursor.fetchall()

            for idx, booking in enumerate(bookings):
                bookings[idx] = {
                    'id': booking[0],
                    'property_id': booking[1],
                    'user_id': booking[2],
                    'time_slot': str(booking[3]),
                    'is_approved': booking[4],
                    'property_name': booking[5],
                    'user_name': booking[6],
                }
        elif type == 'user':
            cursor.execute(
                "SELECT b.*, p.name FROM bookings b LEFT JOIN properties p ON p.id = b.property_id WHERE b.user_id = %s", [id])

            bookings = cursor.fetchall()

            for idx, booking in enumerate(bookings):
                bookings[idx] = {
                    'id': booking[0],
                    'property_id': booking[1],
                    'time_slot': str(booking[3]),
                    'is_approved': booking[4],
                    'property_name': booking[5],
                }
        else:
            response = json.dumps({'response': "Invalid User Type!"})
            return Response(response, status=200, mimetype='application/json')

        cursor.close()
        database.close()

        response = json.dumps({'data': bookings})
        return Response(response, status=200, mimetype='application/json')
    except Exception as err:
        print(err)
        response = json.dumps({'response': "Something went wrong!"})
        return Response(response, status=500, mimetype='application/json')


@app.route("/property/book", methods=['POST'])
def book_property():
    try:
        body = json.loads(request.data)

        property_id = body.get('property_id')
        user_id = body.get('user_id')
        date_time = body.get('date_time')

        if not property_id or not user_id or not datetime:
            response = json.dumps(
                {'response': 'Property Id, User I datetime are required!'})
            return Response(response, status=422, mimetype='application/json')

        database = db_connect()
        cursor = database.cursor(buffered=True)

        cursor.execute(
            f"INSERT INTO bookings VALUES (%s, %s, %s, %s, %s)", (None, property_id, user_id, date_time, 0))

        database.commit()
        cursor.close()
        database.close()

        response = json.dumps({'response': "Created booking request!"})
        return Response(response, status=200, mimetype='application/json')
    except Exception as err:
        response = json.dumps({'response': "Something went wrong!"})
        return Response(response, status=500, mimetype='application/json')


@app.route("/property/book", methods=['PUT'])
def update_property_booking():
    try:
        body = json.loads(request.data)

        id = body.get('id')
        is_approved = body.get('is_approved')

        if not id or not is_approved:
            response = json.dumps(
                {'response': 'Id and approval or rejection is required!'})
            return Response(response, status=422, mimetype='application/json')

        database = db_connect()
        cursor = database.cursor(buffered=True)

        cursor.execute(
            f"UPDATE bookings SET is_approved = %s WHERE id = %s", (is_approved, id))

        database.commit()
        cursor.close()
        database.close()

        response = json.dumps({'response': "Booking updated!"})
        return Response(response, status=200, mimetype='application/json')
    except Exception as err:
        response = json.dumps({'response': "Something went wrong!"})
        return Response(response, status=500, mimetype='application/json')

#if __name__== '__main__':
#    app.run()

#if __name__ == '__main__':
#    app.run(debug=True, port=5000)

app.run(host="0.0.0.0", port="5000")