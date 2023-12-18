import mysql.connector
host="localhost"
username="root"
passwd="huyhuyhuy1312"
database="iot"
db=mysql.connector.connect(
    host=host,
    user=username,
    passwd=passwd,
    database=database
)
myCursor=db.cursor()
# myCursor.execute("select username, password from user where id<=8")
# for x in myCursor:
#     print(x)