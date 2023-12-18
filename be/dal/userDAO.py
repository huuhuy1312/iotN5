import mysql.connector
from dal.DBContext import host,username,passwd,database


class User:
    def __init__(self, id, username, password, email):
        self.id=id
        self.username=username
        self.password=password
        self.email=email
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "password": self.password,
            "email":self.email
        }
def checkUserExist(usernamedn, passworddn):
    db = mysql.connector.connect(
        host=host,
        user=username,
        passwd=passwd,
        database=database
    )
    myCursor = db.cursor()
    sql = "SELECT * FROM iot.user WHERE username = %s AND password = %s"
    myCursor.execute(sql, (usernamedn, passworddn))
    record = myCursor.fetchone()
    db.close()
    if record is not None:
        print(record)
        return record[0]
    else:
        return None

    

def getAllUsers():
    db=mysql.connector.connect(
        host=host,
        user=username,
        passwd=passwd,
        database=database
    )
    myCursor=db.cursor()
    myCursor.execute("SELECT * FROM iot.user")
    records=[]
    for item in myCursor:
        records.append(User(item[0],item[1],item[2],item[3]))
    return records

def saveUser(data):
    db = mysql.connector.connect(
        host=host,
        user=username,
        passwd=passwd,
        database=database
    )
    myCursor = db.cursor()
    print(data["password"])
    sql = "UPDATE iot.user SET username=%s, password=%s, email=%s WHERE ID=%s"
    myCursor.execute(sql, (data["username"], data["password"], data["email"], data["id"]))
    
    db.commit()
    db.close()
 
def getUserByEmail(email):
    db = mysql.connector.connect(
        host=host,
        user=username,
        passwd=passwd,
        database=database
    )
    myCursor = db.cursor()
    sql = "SELECT * FROM iot.user WHERE email = %s"
    myCursor.execute(sql, (email,))
    
    record = myCursor.fetchone()
    user = None  

    if record is not None:
        user = User(record[0], record[1], record[2], record[3], record[4], record[5]).to_dict()
        return user
    else:
        return None
    

def insertUser(data):
    db=mysql.connector.connect(
        host=host,
        user=username,
        passwd=passwd,
        database=database
    )
    myCursor=db.cursor()
    sql="insert into user(username, password, email) values (%s,%s,%s)"
    myCursor.execute(sql,data)
    db.commit()
