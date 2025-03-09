import mysql.connector


def db_connect():
    try:
        database = mysql.connector.connect(
            host="kc-adventure-db.c3cce2seyor9.us-east-2.rds.amazonaws.com", 
            user="admin",
            password="admin1234",
            database="kc-adventure-db"
        )

        return database
    except Exception as err:
        raise Exception(err)
