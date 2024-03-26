from flask import Flask, request, session, jsonify
from flask_session import Session
import sqlite3
import logging
import traceback
import sys
from datetime import datetime
from flask_cors import CORS
from datetime import datetime, timedelta
from Crypto.Cipher import AES
from Crypto.Hash import SHA256
import base64

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
# app.config["SESSION_TYPE"] = "MYSECRETKEY12345"
Session(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/calldb")
def calldb(): 
    inittables()
    # printalltables()  
    return "<p>Database Created..</p>"

@app.route("/get_current_user_info")
def get_current_user_info():
    if 'user_det' in session:
        response = jsonify(session['user_det']) #, status=200, mimetype='application/json')
        response.headers.add("Access-Control-Allow-Origin", "*")     
        return response, 200
    return {'SNAME': 'session could not be established', 'TITLE': '', 'QUALIFICATION': '', 'TYPE': '', 'DEPARTMENT': ''}, 400


@app.route("/usercheck", methods = ['POST'])
def checkLogin():
    data = request.get_json()
    username = data['username']
    password = data['password']
    user = usercheck(parameters=(username, password))
    if user:
        user = user[0]
        userdet = {"SID": user["SID"], "SNAME": user["SNAME"], "TITLE": user["TITLE"], "TYPE": user["TYPE"], "QUALIFICATION": user["QUALIFICATION"], "DEPARTMENT": ""}
        session['user_det'] = userdet
        if 'user_det' in session:
            response = jsonify(userdet) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Unauthorized User"}, 401

@app.route("/getdept")
def getdept():
    alldepts = getdept()
    if alldepts:
        if 'user_det' in session:
            response = jsonify(alldepts) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table Department EMPTY"}, 401

# ------------------------  STAFFDETAILS

@app.route("/insertstaff", methods = ['POST'])
def insertstaff():
    data = dict(request.get_json())
    resp = insertstaff(data)
    if resp:
        if 'user_det' in session:
            response = jsonify({"OUTPUT": resp}) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table Staffdetails Insert error"}, 401

@app.route("/updatestaff", methods = ['POST'])
def updatestaff():
    data = dict(request.get_json())    
    resp = updatestaff(data)
    # app.logger.info(resp)
    if resp:
        if 'user_det' in session:
            response = jsonify({"OUTPUT": "SUCCESS"}) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table Staffdetails Update error"}, 401


@app.route("/deletestaff", methods = ['POST'])
def deletestaff():
    data = dict(request.get_json())    
    resp = deletestaff(data)
    # app.logger.info(resp)
    if resp:
        if 'user_det' in session:
            response = jsonify({"OUTPUT": "SUCCESS"}) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table Staffdetails Delete error"}, 401

@app.route("/getallstaffs")
def getallstaffs():        
    resp = getallstaffs()    
    if resp:
        if 'user_det' in session:
            # app.logger.info(resp[:2])
            response = jsonify(resp) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table Staffdetails select error"}, 401

@app.route("/getalldoctors")
def getalldoctors():        
    resp = getalldoctors()    
    # app.logger.info(resp)
    if resp:
        if 'user_det' in session:
            # app.logger.info(resp[:2])
            response = jsonify(resp) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table Staffdetails select error"}, 401

@app.route("/getallsids")
def getallsids():
    allstaffs = getallsids()
    if allstaffs:
        if 'user_det' in session:
            response = jsonify(allstaffs) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table Department EMPTY"}, 401

@app.route("/getbysid", methods = ['POST'])
def getbysid():
    data = dict(request.get_json())        
    resp = getbysid(data)    
    if resp:
        if 'user_det' in session:
            response = jsonify(resp[0]) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table Staffdetails Insert error"}, 401

# ---------------------  PATIENTDETAILS

@app.route("/insertpatient", methods = ['POST'])
def insertpatient():
    data = dict(request.get_json())
    resp = insertpatient(data)
    if resp:
        if 'user_det' in session:
            response = jsonify({"OUTPUT": resp}) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table patientdetails Insert error"}, 401

@app.route("/updatepatient", methods = ['POST'])
def updatepatient():
    data = dict(request.get_json())    
    resp = updatepatient(data)
    # app.logger.info(resp)
    if resp:
        if 'user_det' in session:
            response = jsonify({"OUTPUT": "SUCCESS"}) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table patientdetails Update error"}, 401


@app.route("/deletepatient", methods = ['POST'])
def deletepatient():
    data = dict(request.get_json())    
    resp = deletepatient(data)
    # app.logger.info(resp)
    if resp:
        if 'user_det' in session:
            response = jsonify({"OUTPUT": "SUCCESS"}) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table patientdetails Delete error"}, 401

@app.route("/getallpatients")
def getallpatients():        
    resp = getallpatients()    
    if resp:
        if 'user_det' in session:
            # app.logger.info(resp[:2])
            response = jsonify(resp) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table patientdetails select error"}, 401

@app.route("/getallpids")
def getallpids():
    allpatients = getallpids()
    if allpatients:
        if 'user_det' in session:
            response = jsonify(allpatients) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table Department EMPTY"}, 401

@app.route("/getbypid", methods = ['POST'])
def getbypid():
    data = dict(request.get_json())        
    resp = getbypid(data)    
    if resp:
        if 'user_det' in session:
            response = jsonify(resp[0]) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table Staffdetails Insert error"}, 401

#  ---------------

@app.route("/insertappointment", methods = ['POST'])
def insertappointment():
    data = dict(request.get_json())
    resp = insertappointment(data)
    if resp:
        if 'user_det' in session:
            response = jsonify({"OUTPUT": resp}) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table appointmentdetails Insert error"}, 401

@app.route("/updateappointment", methods = ['POST'])
def updateappointment():
    data = dict(request.get_json())
    resp = updateappointment(data)
    if resp:
        if 'user_det' in session:
            response = jsonify({"OUTPUT": "SUCCESS"}) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table appointmentdetails Insert error"}, 401

@app.route("/getallappointments")
def getallappointments():
    allappointments = getallappointments()
    if allappointments:
        if 'user_det' in session:
            response = jsonify(allappointments) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table Department EMPTY"}, 401


@app.route("/getavalabletimeslotsbysid", methods = ['POST'])
def getavalabletimeslotsbysid():
    data = dict(request.get_json())
    resp = getavalabletimeslotsbysid(data)    
    # print(resp)
    if resp:
        if 'user_det' in session:
            response = jsonify({"OUTPUT": resp}) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table appointmentdetails getavalabletimeslotsbysid error"}, 401


@app.route("/getavalabletimeslotsbysidforupdate", methods = ['POST'])
def getavalabletimeslotsbysidforupdate():
    data = dict(request.get_json())
    resp = getavalabletimeslotsbysidforupdate(data)    
    # print(resp)
    if resp:
        if 'user_det' in session:
            response = jsonify({"OUTPUT": resp}) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table appointmentdetails getavalabletimeslotsbysidforupdate error"}, 401


@app.route("/getallnewappointments")
def getallnewappointments():
    allappointments = getallnewappointments()
    # print(allappointments)
    if allappointments:
        if 'user_det' in session:
            response = jsonify(allappointments) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table appointmentdetails EMPTY"}, 401

# ---------------------------------------------
# Table CancelAppointmentDetails
@app.route("/getallcancelappointments")
def getallcancelappointments():
    allcancelappointments = getallcancelappointments()
    if allcancelappointments:
        if 'user_det' in session:
            response = jsonify(allcancelappointments) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table Department EMPTY"}, 401

@app.route("/cancelappointment", methods = ['POST'])
def cancelappointment():
    data = dict(request.get_json())
    resp = cancelappointment(data)
    if resp:
        if 'user_det' in session:            
            response = jsonify({"OUTPUT": resp}) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table cancel appointmentdetails Insert error"}, 401


# Table Diagnosis 

@app.route("/insertdiagnosis", methods = ['POST'])
def insertdiagnosis():
    data = dict(request.get_json())
    resp = insertdiagnosis(data)
    if resp:
        if 'user_det' in session:
            response = jsonify({"OUTPUT": resp}) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table appointmentdetails Insert error"}, 401

@app.route("/updatediagnosis", methods = ['POST'])
def updatediagnosis():
    data = dict(request.get_json())
    resp = updatediagnosis(data)
    if resp:
        if 'user_det' in session:
            response = jsonify({"OUTPUT": "SUCCESS"}) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table appointmentdetails Insert error"}, 401

@app.route("/getalldiagnoses")
def getalldiagnoses():
    alldiagnoses = getalldiagnoses()
    if alldiagnoses:
        if 'user_det' in session:
            response = jsonify(alldiagnoses) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table Department EMPTY"}, 401


@app.route("/getallappointmentswodiagnosis")
def getallappointmentswodiagnosis():
    alldiagnoses = getallappointmentswodiagnosis()
    if alldiagnoses:
        if 'user_det' in session:
            response = jsonify(alldiagnoses) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table Department EMPTY"}, 401 

@app.route("/usercheckout")
def usercheckout():    
    session.pop('user_det', None)    
    response = jsonify({"OUTPUT": True}) #, status=200, mimetype='application/json')
    response.headers.add("Access-Control-Allow-Origin", "*")     
    return response, 200

# STAFFS 
@app.route("/getallstaffsSTAFF")
def getallstaffsSTAFF():      
    if 'user_det' in session:          
        resp = getallstaffsSTAFF(udet=session['user_det'])    
        if resp:
            # app.logger.info(resp[:2])
            response = jsonify(resp) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table Staffdetails select error"}, 401

@app.route("/getallpatientsSTAFF")
def getallpatientsSTAFF():      
    if 'user_det' in session:          
        resp = getallpatientsSTAFF(udet=session['user_det'])    
        if resp:
            # app.logger.info(resp[:2])
            response = jsonify(resp) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table PATIENTdetails select error"}, 401
   
@app.route("/getallappointmentsDOCTOR")
def getallappointmentsDOCTOR():      
    if 'user_det' in session:          
        resp = getallappointmentsDOCTOR(udet=session['user_det'])    
        if resp:
            # app.logger.info(resp[:2])
            response = jsonify(resp) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table APPOINTMENTdetails select error"}, 401

@app.route("/getalldiagnosesDOCTOR")
def getalldiagnosesDOCTOR():      
    if 'user_det' in session:          
        resp = getalldiagnosesDOCTOR(udet=session['user_det'])    
        if resp:
            # app.logger.info(resp[:2])
            response = jsonify(resp) #, status=200, mimetype='application/json')
            response.headers.add("Access-Control-Allow-Origin", "*")     
            return response, 200
        return "{'error': 'session could not be established'}", 400
    return {'error': "Table APPOINTMENTdetails select error"}, 401

def printalltables():
    connection = getdbconnection()
    printtabledetails(connection, tablename="staffdetails")
    printtabledetails(connection, tablename="patientdetails")
    printtabledetails(connection, tablename="appointmentdetails")
    printtabledetails(connection, tablename="cancelappdetails")
    printtabledetails(connection, tablename="diagnosisdetails")
    connection.close()

def printtabledetails(connection, tablename):
    app.logger.info('Data from ' + tablename)
    cursor = connection.execute("SELECT * from " + tablename)        
    for row in cursor:
        app.logger.info(row)

def getdbconnection():
    return sqlite3.connect('hospital_data.db')  

def usercheck(parameters=('user', 'passwd')):
    return select_by_value(query="SELECT * FROM staffdetails WHERE EMAIL=? AND PASSWD=?", parameters=parameters)
  
def getdept(parameters=None):
    return select_by_value(query="SELECT * FROM deptdetails", parameters=parameters)
    
# Table StaffDetails
def insertstaff(parameters):
    return insertintotable({"tablename": "staffdetails", "values": parameters})

def updatestaff(parameters):    
    return updateintotable({"tablename": "staffdetails", "pkeyname": "SID", "pkeyval": parameters["SID"], "values": parameters})

def getallstaffs(parameters=None):
    return select_by_value(query="""SELECT staffdetails.*, deptdetails.DNAME AS DEPARTMENTNAME FROM staffdetails 
                           INNER JOIN deptdetails on staffdetails.DPID = deptdetails.DPID""", parameters=parameters)

def deletestaff(parameters):    
    return deletefromtable({"tablename": "staffdetails", "pkeyname": "SID", "pkeyval": parameters["SID"]})

def getbysid(parameters=('user')):    
    return select_by_value(query="SELECT * FROM staffdetails WHERE SID=?", parameters=[parameters["SID"]])
    
def getallsids(parameters=None):
    return select_by_value(query="SELECT SID, STAFFID FROM staffdetails", parameters=parameters)

def getalldoctors(parameters=None):
    return select_by_value(query="""SELECT staffdetails.*, deptdetails.DNAME AS DEPARTMENTNAME FROM staffdetails 
                           INNER JOIN deptdetails on staffdetails.DPID = deptdetails.DPID WHERE TYPE LIKE '%DOCTOR'""", parameters=parameters)


# Table PatientDetails
def insertpatient(parameters):
    return insertintotable({"tablename": "patientdetails", "values": parameters})

def updatepatient(parameters):    
    return updateintotable({"tablename": "patientdetails", "pkeyname": "PID", "pkeyval": parameters["PID"], "values": parameters})

def getallpatients(parameters=None):
    return select_by_value(query="SELECT * FROM patientdetails", parameters=parameters)

def deletepatient(parameters):    
    return deletefromtable({"tablename": "patientdetails", "pkeyname": "PID", "pkeyval": parameters["PID"]})

def getbypid(parameters=('user')):    
    return select_by_value(query="SELECT * FROM patientdetails WHERE PID=?", parameters=[parameters["PID"]])
    
def getallpids(parameters=None):
    return select_by_value(query="SELECT PID, PATIENTID FROM patientdetails", parameters=parameters)


#  Table AppointmentDetails
def insertappointment(parameters):
    parameters["APPDATE"] = datetime.strptime(parameters["APPDATE"] + " " + parameters["APPTIME"], "%Y-%m-%d %I:%M %p").strftime("%Y-%m-%d %H:%M:%S")
    return insertintotable({"tablename": "appointmentdetails", "values": parameters})

def getallappointments(parameters=None):
    return select_by_value(query="""SELECT staffdetails.*, deptdetails.DNAME AS DEPARTMENTNAME, patientdetails.*, patientdetails.PATIENTID, appointmentdetails.* FROM appointmentdetails 
                           INNER JOIN deptdetails, staffdetails, patientdetails on appointmentdetails.SID = staffdetails.SID AND staffdetails.DPID = deptdetails.DPID
                           AND appointmentdetails.PID = patientdetails.PID AND CANCELSTATUS=0""", parameters=parameters)

def getavalabletimeslotsbysid(parameters=None):    
    
    dt = datetime(datetime.now().year, datetime.now().month, datetime.now().day, 0, 0, 0)
    if dt == datetime.strptime(parameters["APPDATE"], "%Y-%m-%d"):
        sameday = True
        parameters["APPDATE"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    else:
        sameday = False        
    
    # apptimes = select_by_value(query="""SELECT * FROM appointmentdetails WHERE SID=? AND PID=? AND strftime('%s', APPDATE)>=?""", parameters=[parameters["SID"], parameters["PID"], parameters["APPDATE"]])
    apptimes = select_by_value(query="""SELECT * FROM appointmentdetails WHERE SID=? AND PID=? AND 
                               DATETIME(APPDATE) >= DATETIME('NOW', 'localtime') AND CANCELSTATUS=0""", parameters=[parameters["SID"], parameters["PID"]])
                            #    CAST(strftime('%s', APPDATE) AS INTEGER) >= CAST(strftime('%s', ?)  AS  integer)""", parameters=[parameters["SID"], parameters["PID"], parameters["APPDATE"]])

    print(apptimes, parameters["SID"], parameters["PID"], parameters["APPDATE"])
    if len(apptimes)>0:
        return "WARNING: YOU ALREADY BOOKED AN APPOINTMENT WITH SAME DOCTOR ON " + datetime.strptime(apptimes[0]["APPDATE"], "%Y-%m-%d %H:%M:%S").strftime("%d-%m-%Y %I:%M %p")    

    timeslots = {}
    dt = datetime(datetime.now().year, datetime.now().month, datetime.now().day, 9, 30, 0)
    for x in range(6):
        dt = dt + timedelta(minutes=30)
        if sameday and dt < datetime.now():
            continue
        timeslots[x] = {"TIMESLOT": dt.strftime("%I:%M %p")}
    dt = datetime(datetime.now().year, datetime.now().month, datetime.now().day, 14, 30, 0)
    for x in range(6, 6+10):
        dt = dt + timedelta(minutes=30)
        if sameday and dt < datetime.now():
            continue
        timeslots[x] = {"TIMESLOT": dt.strftime("%I:%M %p")}

    apptimes = select_by_value(query="SELECT * FROM appointmentdetails WHERE SID=? AND DATE(APPDATE)=? AND CANCELSTATUS=0", parameters=[parameters["SID"], parameters["APPDATE"]])
    # app.logger.info(apptimes)
    # print(len(apptimes), len(timeslots))
    if len(apptimes) == len(timeslots): 
        if sameday:       
            dt = datetime.strptime(parameters["APPDATE"], "%Y-%m-%d %H:%M:%S").strftime("%d-%m-%Y")       
        else:
            dt = datetime.strptime(parameters["APPDATE"], "%Y-%m-%d").strftime("%d-%m-%Y")       
        return f"ERROR: NO TIMESLOTS AVAILABLE FOR DATE {dt} FOR THIS DOCTOR"

    atimes = []
    for x in timeslots.items():
        foundflag = False
        for ts in apptimes:                    
            if datetime.strptime(ts["APPDATE"], "%Y-%m-%d %H:%M:%S").strftime("%I:%M %p") == x[1]["TIMESLOT"]: 
                foundflag = True
                break
        if not foundflag:
            atimes.append(x[1])
                
    # app.logger.info(atimes)
    if len(atimes) == 0:
        for x in timeslots.items():        
            atimes.append(x[1])    
        
    return atimes

def getavalabletimeslotsbysidforupdate(parameters=None):    
    
    dt = datetime(datetime.now().year, datetime.now().month, datetime.now().day, 0, 0, 0)
    if dt == datetime.strptime(parameters["APPDATE"], "%Y-%m-%d"):
        sameday = True
        parameters["APPDATE"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    else:
        sameday = False        
    
    timeslots = {}
    dt = datetime(datetime.now().year, datetime.now().month, datetime.now().day, 9, 30, 0)
    for x in range(6):
        dt = dt + timedelta(minutes=30)
        if sameday and dt < datetime.now():
            continue
        timeslots[x] = {"TIMESLOT": dt.strftime("%I:%M %p")}
    dt = datetime(datetime.now().year, datetime.now().month, datetime.now().day, 14, 30, 0)
    for x in range(6, 6+10):
        dt = dt + timedelta(minutes=30)
        if sameday and dt < datetime.now():
            continue
        timeslots[x] = {"TIMESLOT": dt.strftime("%I:%M %p")}

    apptimes = select_by_value(query="SELECT * FROM appointmentdetails WHERE SID=? AND DATE(APPDATE)=? AND CANCELSTATUS=0", parameters=[parameters["SID"], parameters["APPDATE"]])
    # app.logger.info(apptimes)
    # print(len(apptimes), len(timeslots))
    if len(apptimes) == len(timeslots): 
        if sameday:       
            dt = datetime.strptime(parameters["APPDATE"], "%Y-%m-%d %H:%M:%S").strftime("%d-%m-%Y")       
        else:
            dt = datetime.strptime(parameters["APPDATE"], "%Y-%m-%d").strftime("%d-%m-%Y")       
        return f"ERROR: NO TIMESLOTS AVAILABLE FOR DATE {dt} FOR THIS DOCTOR"

    atimes = []
    for x in timeslots.items():
        foundflag = False
        for ts in apptimes:                    
            if datetime.strptime(ts["APPDATE"], "%Y-%m-%d %H:%M:%S").strftime("%I:%M %p") == x[1]["TIMESLOT"]: 
                foundflag = True
                break
        if not foundflag:
            atimes.append(x[1])
                
    # app.logger.info(atimes)
    if len(atimes) == 0:
        for x in timeslots.items():        
            atimes.append(x[1])    
        
    return atimes

def getallnewappointments(parameters=None):
    return select_by_value(query="""SELECT staffdetails.*, deptdetails.DNAME AS DEPARTMENTNAME, patientdetails.*, patientdetails.PATIENTID, appointmentdetails.* FROM appointmentdetails 
                           INNER JOIN deptdetails, staffdetails, patientdetails on appointmentdetails.SID = staffdetails.SID AND staffdetails.DPID = deptdetails.DPID
                           AND appointmentdetails.PID = patientdetails.PID AND DATETIME(appointmentdetails.APPDATE) >= DATETIME('NOW', 'localtime')
                           AND CANCELSTATUS = 0""", parameters=parameters)
    # return select_by_value(query="SELECT * FROM appointmentdetails WHERE DATETIME(APPDATE) >= DATETIME('NOW', 'localtime')", parameters=parameters)

def updateappointment(parameters=None):
    parameters["APPDATE"] = datetime.strptime(parameters["APPDATE"] + " " + parameters["APPTIME"], "%Y-%m-%d %I:%M %p").strftime("%Y-%m-%d %H:%M:%S")
    del parameters["APPTIME"]
    return updateintotable({"tablename": "appointmentdetails", "pkeyname": "AID", "pkeyval": parameters["AID"], "values": parameters})


# Table CancelAppointmentDetails
def getallcancelappointments(parameters=None):
        return select_by_value(query="""SELECT staffdetails.*, deptdetails.DNAME AS DEPARTMENTNAME, patientdetails.*, appointmentdetails.*, cancelappdetails.*  FROM cancelappdetails
                        INNER JOIN deptdetails, staffdetails, patientdetails, appointmentdetails on cancelappdetails.SID = staffdetails.SID
                        AND cancelappdetails.PID = patientdetails.PID
                        AND cancelappdetails.SID = appointmentdetails.SID
                        AND cancelappdetails.PID = appointmentdetails.PID
                        AND appointmentdetails.SID = staffdetails.SID AND staffdetails.DPID = deptdetails.DPID
                        AND appointmentdetails.PID = patientdetails.PID
                        AND appointmentdetails.CANCELSTATUS = 1""", parameters=parameters)

def cancelappointment(parameters):
    parameters["CAPPDATE"] = parameters["APPDATE"]
    respins = insertintotable({"tablename": "cancelappdetails", "values": parameters})
    if respins.startswith("ERR"):
        return respins + " INSERT cancelappdetails TABLE"    
    if not updateintotable({"tablename": "appointmentdetails", "pkeyname": "AID", "pkeyval": parameters["AID"], "values": {"CANCELSTATUS": 1}}):       
        return respins + "ERROR: DELETE appointmentdetails TABLE"
    return respins


# Table DiagnosisDetails
def insertdiagnosis(parameters):    
    return insertintotable({"tablename": "diagnosisdetails", "values": parameters})

def updatediagnosis(parameters):    
    parameters["DGID"] = int(parameters["DGID"])    
    return updateintotable({"tablename": "diagnosisdetails", "pkeyname": "DGID", "pkeyval": parameters["DGID"], "values": parameters})

def getalldiagnoses(parameters=None):
    return select_by_value(query="""SELECT deptdetails.DNAME AS DEPARTMENTNAME, staffdetails.*, patientdetails.*, appointmentdetails.*, diagnosisdetails.* FROM diagnosisdetails  
                    INNER JOIN deptdetails, staffdetails, patientdetails, appointmentdetails on staffdetails.DPID = deptdetails.DPID
                    AND diagnosisdetails.SID = staffdetails.SID
                    AND diagnosisdetails.PID = patientdetails.PID 
                    AND diagnosisdetails.AID = appointmentdetails.AID 
                    AND diagnosisdetails.PID = appointmentdetails.PID
                    AND diagnosisdetails.SID = appointmentdetails.SID
                    AND appointmentdetails.CANCELSTATUS = 0""", parameters=parameters)

def getallappointmentswodiagnosis(parameters=None):
    return select_by_value(query="""SELECT deptdetails.DNAME AS DEPARTMENTNAME, staffdetails.*, patientdetails.*, appointmentdetails.* FROM appointmentdetails  
                    INNER JOIN deptdetails, staffdetails, patientdetails on staffdetails.DPID = deptdetails.DPID
                    AND appointmentdetails.SID = staffdetails.SID
                    AND appointmentdetails.PID = patientdetails.PID                     
                    AND appointmentdetails.CANCELSTATUS = 0
                    AND appointmentdetails.AID NOT IN (SELECT AID FROM diagnosisdetails)""", parameters=parameters)

# ------------------------------------------------------
# STAFF
def getallstaffsSTAFF(parameters=None, udet=None):    
    return select_by_valueSTAFF(query="""SELECT staffdetails.*, deptdetails.DNAME AS DEPARTMENTNAME FROM staffdetails 
                           INNER JOIN deptdetails on staffdetails.DPID = deptdetails.DPID""", parameters=parameters, UDET=udet)
    # , clnm=['STAFFID'])

def getallpatientsSTAFF(parameters=None, udet=None):    
    return select_by_valueSTAFF(query="SELECT * FROM patientdetails", parameters=parameters, UDET=udet)

def getallappointmentsDOCTOR(parameters=None, udet=None):
    return select_by_valueDOCTOR(query="""SELECT staffdetails.*, deptdetails.DNAME AS DEPARTMENTNAME, patientdetails.*, patientdetails.PATIENTID, appointmentdetails.* FROM appointmentdetails 
                           INNER JOIN deptdetails, staffdetails, patientdetails on appointmentdetails.SID = staffdetails.SID AND staffdetails.DPID = deptdetails.DPID
                           AND appointmentdetails.PID = patientdetails.PID AND CANCELSTATUS=0""", parameters=parameters, UDET=udet)

def getalldiagnosesDOCTOR(parameters=None, udet=None):
    return select_by_valueDOCTOR(query="""SELECT deptdetails.DNAME AS DEPARTMENTNAME, staffdetails.*, patientdetails.*, appointmentdetails.*, diagnosisdetails.* FROM diagnosisdetails  
                    INNER JOIN deptdetails, staffdetails, patientdetails, appointmentdetails on staffdetails.DPID = deptdetails.DPID
                    AND diagnosisdetails.SID = staffdetails.SID
                    AND diagnosisdetails.PID = patientdetails.PID 
                    AND diagnosisdetails.AID = appointmentdetails.AID 
                    AND diagnosisdetails.PID = appointmentdetails.PID
                    AND diagnosisdetails.SID = appointmentdetails.SID
                    AND appointmentdetails.CANCELSTATUS = 0""", parameters=parameters, UDET=udet)

def encrypt(rows, aes_key, clnm=None):

    hash_obj = SHA256.new(aes_key.encode('utf-8'))    
    hkey = hash_obj.digest()
    cipher = AES.new(hkey, AES.MODE_CFB)    
    for row in rows:
        for rkl in row:
            if clnm is not None and str(rkl) in clnm:
                continue
            row.update( {rkl: str(cipher.encrypt(str(row[rkl]).encode()))} )        
    
    return rows

def decrypt( aes_key, enc ):
    enc = base64.b64decode(enc)    
    cipher = AES.new(aes_key, AES.MODE_CBC)
    return cipher.decrypt( enc ) 


def executequery(query, values):
    connection = getdbconnection()
    cursor = connection.cursor()        
    cursor.execute('PRAGMA foreign_keys = ON;')
    successflag = True
    try:        
        cursor.execute(query, values)
        connection.commit()
    except sqlite3.Error as er:
        # app.logger.info('SQLite error: %s' % (' '.join(er.args)))
        app.logger.info("Exception class is: ", er.__class__)
        # app.logger.info('SQLite traceback: ')
        # exc_type, exc_value, exc_tb = sys.exc_info()
        # app.logger.info(traceback.format_exception(exc_type, exc_value, exc_tb))
        tmp = ' '.join(er.args)
        # UNIQUE constraint failed staffdetails.EMAIL
        if tmp.__contains__("UNIQUE constraint failed") and tmp.__contains__("EMAIL"):            
            raise Exception("UNIQUE constraint failed: staffdetails.EMAIL") 
        connection.rollback()
        successflag = False
    except:
        successflag = False
    # printtabledetails(connection, tablename="staffdetails")
    cursor.close()
    connection.close()
    # app.logger.info(successflag)
    return successflag

def insertintotable(info):    
    values = info["values"]
    if info["tablename"] == "deptdetails":
        depts = select_by_value(query="SELECT max(DPID) as NUMRECS FROM deptdetails")[0]
        values["DPID"] = 'DP{0:03d}'.format(depts["NUMRECS"]+1)
        idnum = values["DPID"] 
        query = 'INSERT INTO deptdetails VALUES(:DEPARTMENTID, :DNAME)'
    elif info["tablename"] == "staffdetails":
        staffs = select_by_value(query="SELECT max(SID) as NUMRECS FROM staffdetails")[0]        
        values["STAFFID"] = 'S{0:03d}'.format(staffs["NUMRECS"]+1)
        idnum = values["STAFFID"] 
        query = """INSERT INTO staffdetails(STAFFID, TYPE, TITLE, SNAME, QUALIFICATION, EXPERTISE, DPID, JOINDATE, ADDRESS, DESIGNATION, EMAIL, PASSWD, DOB, SEX)
        VALUES(:STAFFID, :TYPE, :TITLE, :SNAME, :QUALIFICATION, :EXPERTISE, :DPID, :JOINDATE, :ADDRESS, :DESIGNATION, :EMAIL, :PASSWD, :DOB, :SEX)"""
    elif info["tablename"] == "patientdetails":
        pats = select_by_value(query="SELECT max(PID) as NUMRECS FROM patientdetails")[0]
        values["PATIENTID"] = 'P{0:03d}'.format(pats["NUMRECS"]+1)
        values["ADDEDDATE"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        values["AGE"] = int(values["AGE"])
        idnum = values["PATIENTID"] 
        query = 'INSERT INTO patientdetails(PATIENTID, PNAME, ADDRESS, ADDEDDATE, MOBILE, SEX, AGE) VALUES(:PATIENTID, :PNAME, :ADDRESS, :ADDEDDATE, :MOBILE, :SEX, :AGE)'
    elif info["tablename"] == "appointmentdetails":
        appts = select_by_value(query="SELECT max(AID) as NUMRECS FROM appointmentdetails")[0]
        values["AID"] = appts["NUMRECS"]+1        
        idnum = 'A{0:03d}'.format(values["AID"]) 
        # print(values["APPDATE"])
        query = 'INSERT INTO appointmentdetails(APPDATE, SID, PID) VALUES(:APPDATE, :SID, :PID)'
    elif info["tablename"] == "cancelappdetails":
        canappts = select_by_value(query="SELECT max(CID) as NUMRECS FROM cancelappdetails")[0]        
        values["CID"] = canappts["NUMRECS"]+1        
        idnum = 'C{0:03d}'.format(values["CID"]) 
        query = 'INSERT INTO cancelappdetails(CAPPDATE, SID, PID, AID) VALUES(:CAPPDATE, :SID, :PID, :AID)'
    else:
        diagdets = select_by_value(query="SELECT max(DGID) as NUMRECS FROM diagnosisdetails")[0]
        values["DGID"] = diagdets["NUMRECS"]+1        
        idnum = 'DG{0:03d}'.format(values["DGID"]) 
        query = 'INSERT INTO diagnosisdetails(DIAGNOSIS, PRESCRIPTION, SID, PID, AID) VALUES(:DIAGNOSIS, :PRESCRIPTION, :SID, :PID, :AID)'
    try:
        result = executequery(query=query, values=values)
    except Exception as er:
        tmp = ' '.join(er.args)
        if tmp.__contains__("UNIQUE constraint failed") and tmp.__contains__("EMAIL"):     
            return "ERROR: EMAIL ALREADY FOUND...PLEASE ENTER AGAIN..."
        else:
            return "ERROR:" + str(er.__class__)
    if result:
        return idnum
    return "ERROR"

def updateintotable(info):                #conn, table, data, pkeyname, pkeyval):
    tablename, pkeyname = info["tablename"], info["pkeyname"]
    query = f"UPDATE {tablename} SET " + ', '.join("{}=?".format(k) for k in info["values"].keys()) + f" WHERE {pkeyname}=?"
    # app.logger.info(query)
    # app.logger.info(list(info["values"].values()) + [info["pkeyval"]])    
    return executequery(query=query, values=list(info["values"].values()) + [info["pkeyval"]])

def deletefromtable(info):
    tablename, pkeyname = info["tablename"], info["pkeyname"]
    query = f'DELETE FROM {tablename} WHERE {pkeyname}=?'    
    return executequery(query=query, values=[info["pkeyval"]])

def select_by_value(query, parameters=None):
    connection = getdbconnection()
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()        
    rows = None
    try:              
        if parameters is not None:
            cursor.execute(query, parameters)
        else:
            cursor.execute(query)
        rows = [dict(row) for row in cursor.fetchall()]
    except sqlite3.Error as er:
        app.logger.info('SQLite error: %s' % (' '.join(er.args)))
        app.logger.info("Exception class is: ", er.__class__)
        app.logger.info('SQLite traceback: ')
        exc_type, exc_value, exc_tb = sys.exc_info()
        app.logger.info(traceback.format_exception(exc_type, exc_value, exc_tb))
    except:
        pass
    # printtabledetails(connection, tablename="staffdetails")   
    # app.logger.info(successflag)
    cursor.close()
    connection.close()
    return rows

def select_by_valueSTAFF(query, parameters=None, UDET=None, clnm=None):
    connection = getdbconnection()
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()        
    rows = None
    try:              
        if parameters is not None:
            cursor.execute(query, parameters)
        else:
            cursor.execute(query)
        rows = [dict(row) for row in cursor.fetchall()]
        if UDET is not None:            
            aes_key = str(UDET["SID"]) + UDET["SNAME"]            
            rows = encrypt(rows, aes_key, clnm)
    except sqlite3.Error as er:
        app.logger.info('SQLite error: %s' % (' '.join(er.args)))
        app.logger.info("Exception class is: ", er.__class__)
        app.logger.info('SQLite traceback: ')
        exc_type, exc_value, exc_tb = sys.exc_info()
        app.logger.info(traceback.format_exception(exc_type, exc_value, exc_tb))
    except:
        pass
    # printtabledetails(connection, tablename="staffdetails")   
    # app.logger.info(successflag)
    cursor.close()
    connection.close()
    return rows

def encrypt2(rows, aes_key, SSID=None, clnm=None):

    hash_obj = SHA256.new(aes_key.encode('utf-8'))    
    hkey = hash_obj.digest()
    cipher = AES.new(hkey, AES.MODE_CFB)    
    for row in rows:
        if row["SID"] == SSID: continue
        for rkl in row:
            if clnm is not None and str(rkl) in clnm:
                continue
            row.update( {rkl: str(cipher.encrypt(str(row[rkl]).encode()))} ) 

    return rows

def select_by_valueDOCTOR(query, parameters=None, UDET=None, clnm=None):
    connection = getdbconnection()
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()        
    rows = None
    try:              
        if parameters is not None:
            cursor.execute(query, parameters)
        else:
            cursor.execute(query)
        rows = [dict(row) for row in cursor.fetchall()]
        if UDET is not None:            
            aes_key = str(UDET["SID"]) + UDET["SNAME"]            
            rows = encrypt2(rows, aes_key, UDET["SID"], clnm)
    except sqlite3.Error as er:
        app.logger.info('SQLite error: %s' % (' '.join(er.args)))
        app.logger.info("Exception class is: ", er.__class__)
        app.logger.info('SQLite traceback: ')
        exc_type, exc_value, exc_tb = sys.exc_info()
        app.logger.info(traceback.format_exception(exc_type, exc_value, exc_tb))
    except:
        pass
    # printtabledetails(connection, tablename="staffdetails")   
    # app.logger.info(successflag)
    cursor.close()
    connection.close()
    return rows


def inittables():
    connection = getdbconnection()
    cursor = connection.cursor() 
    cursor.execute(''' CREATE TABLE IF NOT EXISTS deptdetails
            (DPID            INTEGER    PRIMARY KEY,
            DEPARTMENTID    TEXT    UNIQUE  NOT NULL,
            DNAME           TEXT    UNIQUE  NOT NULL);
        ''')    
    
    cursor.execute(''' CREATE TABLE IF NOT EXISTS staffdetails
            (SID            INTEGER    PRIMARY KEY,
            STAFFID         TEXT    UNIQUE  NOT NULL,
            PASSWD          TEXT    NOT NULL,            
            TYPE            TEXT    NOT NULL,
            TITLE           TEXT    NOT NULL,
            SNAME           TEXT    NOT NULL,
            SEX             TEXT    NOT NULL,
            DOB             TEXT    NOT NULL,
            QUALIFICATION   TEXT    NOT NULL,
            DESIGNATION     TEXT    NOT NULL,
            EXPERTISE       TEXT    NOT NULL,
            JOINDATE        TEXT    NOT NULL,
            DPID            INTEGER NOT NULL,            
            EMAIL           TEXT    UNIQUE  NOT NULL,
            ADDRESS         TEXT,            
            FOREIGN KEY (DPID)   REFERENCES deptdetails (DPID));
            ''')
    
    cursor.execute(''' CREATE TABLE IF NOT EXISTS patientdetails
            (PID            INTEGER    PRIMARY KEY,
            PATIENTID       TEXT    NOT NULL,
            PNAME           TEXT    NOT NULL,
            AGE             INTEGER NOT NULL,            
            SEX             TEXT    NOT NULL,
            ADDEDDATE       TEXT    NOT NULL,
            ADDRESS         TEXT    NOT NULL,
            MOBILE          TEXT DEFAULT NULL);            
            ''')
    
    cursor.execute(''' CREATE TABLE IF NOT EXISTS appointmentdetails
            (AID           INTEGER     PRIMARY KEY,
            APPDATE        TEXT    NOT NULL,
            SID            INTEGER NOT NULL,
            PID            INTEGER NOT NULL,
            CANCELSTATUS   INTEGER DEFAULT 0,
            FOREIGN KEY (SID)   REFERENCES staffdetails (SID) ON DELETE CASCADE,
            FOREIGN KEY (PID)   REFERENCES patientdetails (PID) ON DELETE CASCADE);            
            ''')
    
    cursor.execute(''' CREATE TABLE IF NOT EXISTS cancelappdetails
            (CID           INTEGER     PRIMARY KEY,
            CAPPDATE       TEXT    NOT NULL,
            SID            INTEGER  NOT NULL,
            PID            INTEGER  NOT NULL,
            AID            INTEGER  NOT NULL,
            FOREIGN KEY (SID)   REFERENCES staffdetails (SID) ON DELETE CASCADE,
            FOREIGN KEY (PID)   REFERENCES patientdetails (PID) ON DELETE CASCADE,            
            FOREIGN KEY (AID)   REFERENCES appointmentdetails (AID) );
            ''')
    
    cursor.execute(''' CREATE TABLE IF NOT EXISTS diagnosisdetails
            (DGID           INTEGER     PRIMARY KEY,
            DIAGNOSIS      TEXT    NOT NULL,
            PRESCRIPTION   TEXT    NOT NULL,
            SID            INTEGER    NOT NULL,
            PID            INTEGER    NOT NULL,
            AID            INTEGER    NOT NULL,
            FOREIGN KEY (SID)   REFERENCES staffdetails (SID) ON DELETE CASCADE,
            FOREIGN KEY (PID)   REFERENCES patientdetails (PID) ON DELETE CASCADE,
            FOREIGN KEY (AID)   REFERENCES appointmentdetails (AID) );      
            ''')
    
    depts = [('DP001', 'ADMINSTRATION'),
            ('DP002', 'CARDIOLOGY'),
            ('DP003', 'ORTHOPEDICS'),
            ('DP004', 'GYNAECOLOGY'),
            ('DP005', 'NEUROLOGY')
    ]
    cursor.executemany("INSERT INTO deptdetails(DEPARTMENTID, DNAME) VALUES(?,?)", depts)
    # connection.commit()    
    # printtabledetails(connection=connection, tablename="deptdetails")

    staffs = [('S001', 'ADMIN-DOCTOR', 'Dr.', 'KANNAN', 'M.B.B.S, M.D', 'CARDIOLOGIST', 2, '2007-01-01 00:00:00', '34/4, NEHRU ST, KARAIKAL', 'HOD', 'kannan@gmail.com', '12345', '1959-06-01 00:00:00', 'M'),
            ('S002', 'STAFF', 'Mr.', 'MANIKANDAN', 'B.SC', 'DATA ENTRY', 1, '2012-02-03 00:00:00', '277, MADAKOVIL STREET, KARAIKAL', 'ASSISTANT', 'manikandan@gmail.com', '12345', '1970-07-03 00:00:00', 'M'),
            ('S003', 'DOCTOR', 'Dr.', 'GUNASUNDARI', 'M.B.B.S', 'ORTHO', 3, '2009-06-21 00:00:00', '89, BHARATHIYAR ROAD, KARAIKAL', 'PROFESSOR', 'gunasekar@gmail.com', '12345', '1976-03-10 00:00:00', 'M'),
            ('S004', 'DOCTOR', 'Dr.', 'KALA', 'M.B.B.S, M.D', 'GYNAECOLOGIST', 4, '2020-05-16 00:00:00', '55/2, BHARATHIYAR ROAD, KARAIKAL', 'ASSISTANT PROFESSOR', 'kala@gmail.com', '12345', '1980-05-04 00:00:00', 'F'),
            ('S005', 'DOCTOR', 'Dr.', 'MADAN', 'M.B.B.S, M.S', 'NEURO SURGEON', 5, '2009-06-21 00:00:00', '34/9, MAIN ROAD, KARAIKAL', 'ASSISTANT PROFESSOR', 'madan@gmail.com', '12345', '1986-06-11 00:00:00', 'M'),
            ('S006', 'STAFF', 'Mrs.', 'SUJA', 'B.A', 'DATA ENTRY', 1, '2014-02-03 00:00:00', '29, MADAKOVIL STREET, KARAIKAL', 'ASSISTANT', 'suja@gmail.com', '12345', '2000-10-31 00:00:00', 'F'),
            ('S007', 'ADMIN', 'Ms.', 'NANDINI', 'M.E', 'SYSTEM ADMIN', 1, '2005-03-04 00:00:00', '8, BHARATHIYAR ROAD, KARAIKAL', 'SYSTEM ADMINISTRATOR', 'nandini@gmail.com', '12345', '1995-04-15 00:00:00', 'F')
    ]
    cursor.executemany("INSERT INTO staffdetails(STAFFID, TYPE, TITLE, SNAME, QUALIFICATION, EXPERTISE, DPID, JOINDATE, ADDRESS, DESIGNATION, EMAIL, PASSWD, DOB, SEX) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", staffs)
     
    patients = [('KARAN', 'P001', '6, MAIN ST, TIRUVARUR', '2022-02-03 11:15:01', 'M', 38 ),
                ('HARI', 'P002', '25, VELU NAGAR, KARAIKAL', '2022-12-31 05:17:03', 'M', 40),
                ('SARA', 'P003', '987, KAVIN ST, KOTTUCHERRY', '2023-01-13 09:23:05', 'F', 45),
                ('MAARAN', 'P004', '15, MAIN ROAD, KARAIKAL', '2023-05-23 12:33:40', 'M', 48),
    ]
    cursor.executemany("INSERT INTO patientdetails(PNAME, PATIENTID, ADDRESS, ADDEDDATE, SEX, AGE) VALUES(?,?,?,?,?,?)", patients)
    
    
    appointments = [('2022-02-07 11:00:00', 4, 1, 0),
                    ('2022-01-03 17:00:00', 5, 2, 0),
                    ('2023-01-17 18:30:00', 3, 3, 0),
                    ('2023-05-26 11:00:00', 1, 4, 0),
                    ('2022-02-03 12:15:00', 5, 2, 0),
                    ('2023-07-22 16:15:00', 1, 4, 0),
                    ('2022-04-10 11:00:00', 4, 1, 1),
                    ('2022-02-01 17:00:00', 5, 2, 0),
                    ('2023-02-11 18:30:00', 3, 3, 0),
                    ('2022-03-13 12:15:00', 5, 2, 0),
                    ('2022-08-23 16:15:00', 1, 4, 1)
    ]
    cursor.executemany("INSERT INTO appointmentdetails(APPDATE, SID, PID, CANCELSTATUS) VALUES(?,?,?,?)", appointments)

    cancelappoints = [('2022-08-25 01:15:00', 1, 4, 11),
                        ('2022-04-11 09:00:00', 4, 1, 7)
    ]
    cursor.executemany("INSERT INTO cancelappdetails(CAPPDATE, SID, PID, AID) VALUES(?,?,?,?)", cancelappoints)
    
    diagnoses = [('PREGNANCY', 'MEDICINE', 4, 1, 1),
                ('HEAD INJURY', 'ANTIBIOTIC, PARACETAMOL, SYRUP', 5, 2, 2),
                ('FEVER AND COLD', 'PARACETAMOL, SYRUP', 3, 3, 3),
                ('STROKE', 'ASPIRIN, STROKCHEM', 1, 4, 4),
                ('MIGRAINE', 'ANTIBIOTIC', 5, 2, 5),
                ('HEART BLOCK', 'ATROPINE', 1, 4, 6),
                ('MENTAL ISSUES', 'MEDICINES FOR MENTAL DISORDER', 5, 2, 8),
                ('COVID', 'COVID MEDICINE', 3, 3, 9),
                ('CLOT', 'MEDICINE TO TREAT BRAIN CLOTS', 5, 2, 10),
    ]

    cursor.executemany("INSERT INTO diagnosisdetails(DIAGNOSIS, PRESCRIPTION, SID, PID, AID) VALUES(?,?,?,?,?)", diagnoses)

    connection.commit()
    cursor.close()
    connection.close()
    
    

if __name__ == '__main__':  
   app.run()