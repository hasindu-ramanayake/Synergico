# app.py

import os
import random
import string
import datetime

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email
from python_http_client.exceptions import HTTPError

from flask import Flask, request, jsonify
from firebase_admin import credentials, firestore, initialize_app
from flask_cors import CORS

#sg = sendgrid.SendGridClient("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")

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Firestore DB
cred = credentials.Certificate('key.json')
default_app = initialize_app(cred)
db = firestore.client()

company_ref = db.collection('company')
users_ref = db.collection('users')
vendor_ref = db.collection('vendor')
service_ref = db.collection('service')
order_ref = db.collection('order')
token_ref = db.collection('token')

############################################################################################
############################################################################################
def getRandomKey():
    letters = string.ascii_letters
    key = ''.join(random.choice(letters) for i in range(20))
    return key

def find_one(db_ref , key , value , op ):
    rtn = {}
    docs = db_ref.where(key, op , value).get()
    if len(docs) == 1:
        rtn = docs[0].to_dict()
    
    return rtn

def find_all(db_ref , key , value , op):
    rtn = []
    docs = db_ref.where(key, op , value).get()
    for doc in docs:
        dic = doc.to_dict()
        rtn.append(dic)

    return rtn

def update_all(db_ref, key , value , op , arg_name , newvalue):
    docs = db_ref.where(key , op , value).get()
    if len(docs) == 1 :
        k = docs[0].id 
        db_ref.document(k).update({arg_name : newvalue})

def update_array_all(db_ref, key , value , op , array_name, newvalue):
    docs = db_ref.where(key , op , value).get()
    if len(docs) == 1 :
        k = docs[0].id 
        db_ref.document(k).update({array_name : firestore.ArrayUnion([newvalue])})

def remove_array_all(db_ref, key , value , op , array_name, newvalue):
    docs = db_ref.where(key , op , value).get()
    if len(docs) == 1 :
        k = docs[0].id 
        db_ref.document(k).update({array_name : firestore.ArrayRemove([newvalue])})

def delete_all(db_ref , key , value , op):
    docs = db_ref.where(key, op, value).get() 
    for doc in docs:
        key = doc.id
        db_ref.document(key).delete()

def addToken(username) :
    delete_all(token_ref,"username",username,"==")
    token = getRandomKey()
    now = datetime.datetime.now()
    dt = now.strftime("%m/%d/%Y %H:%M:%S")
    acs = {
        "username" : username,
        "token" : token,
        "timestamp" : dt
    }
    token_ref.add(acs)
    return token

def getTokenData(token) :
    docs = token_ref.where("token", "==" , token).get()
    rtn = {}
    if len(docs) == 1 :
        dic = docs[0].to_dict()
        ts = str(dic["timestamp"])
        print(ts)
        dt1 = datetime.datetime.strptime(ts, "%m/%d/%Y %H:%M:%S")
        print(dt1)
        dt2 = datetime.datetime.now()
        diff = dt2 - dt1
        scnds = int(round(diff.total_seconds()))
        print(scnds)
        if scnds > 1000 :
            delete_all(token_ref,"token",token,"==")
        else:
            rtn = dic
    return rtn

def getUserData(userName) :
    docs = users_ref.where("email", "==" , userName).get()
    rtn = {}
    if len(docs) == 1 :
        rtn = docs[0].to_dict()
    return rtn

def validateRequest(jsn , argList):
    msg = "OK"
    typeList = ["admin", "employee" , "vendor"]
    statusList = [ "new" , "accepted" , "rejected" ]
    for arg in argList:
        if arg not in jsn :
            msg = "Missing argument - " + arg 
            return msg
        
        if len(jsn[arg]) < 1 :
            msg = "Empty argument - " + arg 
            return msg

        if arg == 'type' and (jsn[arg] not in typeList) :
            msg = "Invalid user type - " + arg + " <" + typeList + ">"
            return msg
        
        if arg == 'status' and (jsn[arg] not in statusList) :
            msg = "Invalid order status - " + arg + " <" + statusList + ">"
            return msg

    return msg

def sendMali(type , orderId, customerEmail , customerName, CustomerContact, orderDetails, vendor , vendorEmail, status ):
    sg = SendGridAPIClient('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')
    
    if(type == "new"):
        header = "New Order : " + orderId 
    
    if(type == "change"):
        header = "Change Order Status : " + orderId

    html_content =  "<html> \
                <style>\
                table, th, td {\
                border:1px solid black;\
                }\
                </style>\
                <body>\
                <h2> " + header + "</h2>\
                <table style=\"width:100%\">\
                <tr>\
                    <td>Order ID</td>\
                    <td>"+ orderId + "</td>\
                </tr>\
                <tr>\
                    <td>Status</td>\
                    <td>"+ status + "</td>\
                </tr>\
                <tr>\
                    <td>Customer Name</td>\
                    <td>" + customerName +"</td>\
                </tr>\
                    <tr>\
                    <td>Customer Contact</td>\
                    <td>" +  CustomerContact + "</td>\
                </tr>\
                    <tr>\
                    <td>Vendor</td>\
                    <td>" + vendor + "</td>\
                </tr>\
                <tr>\
                    <td>Vendor Email</td>\
                    <td>"+ vendorEmail + "</td>\
                </tr>\
                    <tr>\
                    <td>Order details</td>\
                    <td>" + orderDetails + "</td>\
                </tr>\
                </table>\
                <p>Thank you</p>\
                </body>\
                </html>"

    message = Mail(
        to_emails="synergyco111@gmail.com",
        from_email=Email('synergyco111@gmail.com', "synergyco"),
        subject=header,
        html_content=html_content
        )
    #message.add_bcc("[YOUR]@gmail.com")
    response = sg.send(message)

#####################################################################################

@app.route('/login', methods=['POST'])
def login():
    """
        Login and get access key
        input -  json={'username': 'email@e1.com', 'password': 'e1234'}
        output - json={'success': true , 'token': token , 'type' : employee,admin,vendor}
    """
    try:
        msg = validateRequest(request.json , ["username" , "password"])
        if(msg != "OK"):
            return jsonify({"success": False, "msg" : msg}), 400
        
        username = request.json['username']
        password = request.json['password']
        doc = find_one(users_ref, "username" , username , "==")
        if doc :
            if doc['password'] == password :
                token = addToken(username)
                res = {
                    "success": True,
                    "token"  : token, 
                    "type"   : doc["type"]
                }
                return jsonify(res), 200
            else :
                return jsonify({"success": False, "msg" : "Invalid password"}), 400
        else :
            return jsonify({"success": False, "msg" : "Invalid user name"}), 400
    except Exception as e:
        return f"An Error Occured: {e}"

@app.route('/signup', methods=['POST'])
def signup():
    """
        signup user
        input - json={'username': 'email@e1.com', 'password': 'e1234' , 'type' : 'employee/admin/vendor' , 'company' : company name }
        output - jason={'success': true}
    """
    try:
        msg = validateRequest(request.json , ["username" , "password" , "type", "company"])
        if(msg != "OK"):
            return jsonify({"success": False, "msg" : msg}), 400

        username = request.json['username']
        type = request.json['type']
        company = request.json['company']

        doc = find_one(users_ref, "username" , username , "==")
        if doc:
            return jsonify({"success": False, "msg" : "Already registered email"}), 400

        if type == "employee" :
            cd = find_one(company_ref, "name" , company , "==")
            if bool(cd) == False :
                return jsonify({"success": False, "msg" : "invalid company"}), 400

        js = request.get_json()
        users_ref.add(js)

        if type == "vendor" :
            vendor_ref.add({'name' : company , 'email' : username})

        return jsonify({"success": True}), 200
    except Exception as e:
        return f"An Error Occured: {e}"

@app.route('/getEmployeeList', methods=['POST'])
def getEmployeeList():
    """
        Get employee list in company
        input json={'token': toke }
        output jason={'success': true , "employeeList" : employee_list}
    """
    try:
        msg = validateRequest(request.json , ["token"])
        if(msg != "OK"):
            return jsonify({"success": False, "msg" : msg}), 400

        #get token from request 
        token = request.json['token']

        #get username from token 
        tokendata = getTokenData(token)
        if bool(tokendata) == False :
            return jsonify({"success": False , "msg" : "invalid token"}), 400

        username = tokendata["username"]
        #get company from  username 
        userdata = find_one(users_ref, "username" , username , "==")
        if bool(userdata) == False:
            return jsonify({"success": False , "msg" : "invalid user"}), 400
        company = userdata['company']

        docs = find_all(users_ref, "company" , company , "==")
        employeeList = []
        for doc in docs :
            if doc["type"] == "employee" :
                employeeList.append(doc["username"])    

        return jsonify({"success": True, "employeeList" : employeeList}), 200
    except Exception as e:
        return f"An Error Occured: {e}"

@app.route('/removeEmployee', methods=['POST'])
def removeEmployee():
    """
        Remove employee in company
        input json={'token': toke , "emplyee" : username }
        output jason={'success': true }
    """
    try:
        msg = validateRequest(request.json , ["token" , "employee"])
        if(msg != "OK"):
            return jsonify({"success": False, "msg" : msg}), 400

        #get token from request 
        token = request.json['token']
        employee = request.json['employee']

        #get username from token 
        tokendata = getTokenData(token)
        if bool(tokendata) == False :
            return jsonify({"success": False , "msg" : "invalid token"}), 400

        username = tokendata["username"]
        #get company from  username 
        userdata = find_one(users_ref, "username" , username , "==")
        if bool(userdata) == False:
            return jsonify({"success": False , "msg" : "invalid user"}), 400
        company = userdata['company']

        doc = find_one(users_ref, "username" , employee , "==" )
        if doc :
            if doc["type"] == "employee" and doc["company"] == company :
                delete_all(users_ref,"username" , employee , "==")

        return jsonify({"success": True}), 200
    except Exception as e:
        return f"An Error Occured: {e}"

@app.route('/getVendorList', methods=['POST'])
def getVendorList():
    """
        Get added vendor list in company
        input json={'token': toke }
        output jason={'success': true , "vendorList" : vendor_list}
    """
    try:
        msg = validateRequest(request.json , ["token"])
        if(msg != "OK"):
            return jsonify({"success": False, "msg" : msg}), 400

        #get token from request 
        token = request.json['token']

        #get username from token 
        tokendata = getTokenData(token)
        if bool(tokendata) == False :
            return jsonify({"success": False , "msg" : "invalid token"}), 400

        username = tokendata["username"]
        #get company from  username 
        userdata = find_one(users_ref, "username" , username , "==")
        if bool(userdata) == False:
            return jsonify({"success": False , "msg" : "invalid user"}), 400
        company = userdata['company']

        companyData = find_one(company_ref, "name" , company , "==")
        if(companyData):
            vendorList = companyData["vendorList"]
            return jsonify({"success": True, "vendorList" : vendorList}), 200

        return jsonify({"success": False}), 400
    except Exception as e:
        return f"An Error Occured: {e}"

@app.route('/getVendorListAll', methods=['POST'])
def getVendorListAll():
    """
        Get not added vendor list in company
        input json={'token': toke }
        output jason={'success': true , "vendorList" : vendor_list}
    """
    try:
        msg = validateRequest(request.json , ["token"])
        if(msg != "OK"):
            return jsonify({"success": False, "msg" : msg}), 400

        #get token from request 
        token = request.json['token']

        #get username from token 
        tokendata = getTokenData(token)
        if bool(tokendata) == False :
            return jsonify({"success": False , "msg" : "invalid token"}), 400

        username = tokendata["username"]
        #get company from  username 
        userdata = find_one(users_ref, "username" , username , "==")
        if bool(userdata) == False:
            return jsonify({"success": False , "msg" : "invalid user"}), 400
        company = userdata['company']
        #print(company)

        vendorList = []
        companyData = find_one(company_ref, "name" , company , "==")
        if(companyData):
            vendorList = companyData["vendorList"]
        #print(vendorList)

        rtn = []
        allVendors = vendor_ref.get()
        for v in allVendors:
            dic = v.to_dict()
            vname = dic["name"]
            if vname not in vendorList: 
                rtn.append(vname) 

        return jsonify({"success": True , "vendorList" : rtn}), 200
    except Exception as e:
        return f"An Error Occured: {e}"

@app.route('/addNewVendor', methods=['POST'])
def addNewVendor():
    """
        Add new vendor in company
        input json={'token': toke , "vendor" : vendor }
        output jason={'success': true}
    """
    try:
        msg = validateRequest(request.json , ["token" , "vendor"])
        if(msg != "OK"):
            return jsonify({"success": False, "msg" : msg}), 400

        #get token from request 
        token = request.json['token']
        vendor = request.json['vendor']
        #get username from token 
        tokendata = getTokenData(token)
        if bool(tokendata) == False :
            return jsonify({"success": False , "msg" : "invalid token"}), 400


        vobj = find_one(vendor_ref, "name" , vendor , "==")
        if bool(vobj) == False :
            return jsonify({"success": False , "msg" : "invalid vendor"}), 400

        username = tokendata["username"]
        print(username)

        #get company from  username 
        userdata = find_one(users_ref, "username" , username , "==")
        if bool(userdata) == False:
            return jsonify({"success": False , "msg" : "invalid user"}), 400
        company = userdata['company']
        print(company)

        update_array_all(company_ref, "name" , company , "==" , "vendorList" , vendor)
        return jsonify({"success": True}), 200

    except Exception as e:
        return f"An Error Occured: {e}"

@app.route('/removeVendor', methods=['POST'])
def removeVendor():
    """
        Remove vendor in company
        input json={'token': toke  , 'vendor' : vendor}
        output jason={'success': true}
    """
    try:
        msg = validateRequest(request.json , ["token" , "vendor"])
        if(msg != "OK"):
            return jsonify({"success": False, "msg" : msg}), 400

        #get token from request 
        token = request.json['token']
        vendor = request.json['vendor']
        #get username from token 
        tokendata = getTokenData(token)
        if bool(tokendata) == False :
            return jsonify({"success": False , "msg" : "invalid token"}), 400


        vobj = find_one(vendor_ref, "name" , vendor , "==")
        if bool(vobj) == False :
            return jsonify({"success": False , "msg" : "invalid vendor"}), 400

        username = tokendata["username"]
        print(username)

        #get company from  username 
        userdata = find_one(users_ref, "username" , username , "==")
        if bool(userdata) == False:
            return jsonify({"success": False , "msg" : "invalid user"}), 400
        company = userdata['company']
        print(company)

        remove_array_all(company_ref, "name" , company , "==" , "vendorList" , vendor)
        return jsonify({"success": True}), 200

    except Exception as e:
        return f"An Error Occured: {e}"

@app.route('/addOrder', methods=['POST'])
def addOrder():
    """
        Add new order
        input json={'token': toke , 'vendor' : vendor , 'customerName' : customer_name , 'email' : customer_email , 'contact' : customer_contact , 'details' : details }
        output jason={'success': true , "vendorList" : vendor_list}
    """
    try:
        msg = validateRequest(request.json , ["token" , "vendor", "customerName", "email", "contact", "details"])
        if(msg != "OK"):
            return jsonify({"success": False, "msg" : msg}), 400

        #get token from request 
        token = request.json['token']
        vendor = request.json['vendor']

        #get username from token 
        tokendata = getTokenData(token)
        if bool(tokendata) == False :
            return jsonify({"success": False , "msg" : "invalid token"}), 400

        username = tokendata["username"]
        #get company from  username 
        userdata = find_one(users_ref, "username" , username , "==")
        if bool(userdata) == False:
            return jsonify({"success": False , "msg" : "invalid user"}), 400
        company = userdata['company']

        vendorData = find_one(vendor_ref, "name" , vendor , "==")
        if bool(vendorData) == False :
             return jsonify({"success": False , "msg" : "invalid vendor"}), 400
            
        orderId = getRandomKey()
        order = {
            "id" : orderId,
            "timestamp" : datetime.datetime.now(),
            "username" : username,
            "customerName" : request.json['customerName'],
            "email" : request.json['email'],
            "contact" : request.json['contact'],
            "company" : company,
            "vendor" : vendor,
            "details" : request.json['details'],
            "status" : "new"
        }
        order_ref.add(order)

        sendMali("new" , orderId, request.json['email'],  request.json['customerName'], request.json['contact'], request.json['details'], vendor , vendorData["email"] , "new")

        return jsonify({"success": True}), 200

    except Exception as e:
        return f"An Error Occured: {e}"

@app.route('/changeOrderStatus', methods=['POST'])
def changeOrderStatus():
    """
        Change order status
        input json={'token': toke  , 'orderId' : id , 'status' : status}
        output jason={'success': true}
    """
    try:
        msg = validateRequest(request.json , ["token" , "orderId", "status"])
        if(msg != "OK"):
            return jsonify({"success": False, "msg" : msg}), 400

        token = request.json['token']
        orderId = request.json['orderId']
        status = request.json['status']
        tokendata = getTokenData(token)
        if bool(tokendata) == False :
            return jsonify({"success": False , "msg" : "invalid token"}), 400

        username = tokendata["username"]
        #get company from  username p
        userdata = find_one(users_ref, "username" , username , "==")
        if bool(userdata) == False:
            return jsonify({"success": False , "msg" : "invalid user"}), 400

        orderData = find_one(order_ref,"id", orderId ,"==")
        if(orderData) :
            vendorData = find_one(vendor_ref, "name" ,  orderData["vendor"] , "==")
            if bool(vendorData) == False :
                return jsonify({"success": False , "msg" : "invalid vendor"}), 400
            
            update_all(order_ref,"id", orderId ,"==","status",status)
            sendMali("change" , orderId , orderData['email'],  orderData['customerName'], orderData['contact'], orderData['details'], orderData["vendor"], vendorData["email"] ,status)

        return jsonify({"success": True}), 200

    except Exception as e:
        return f"An Error Occured: {e}"

@app.route('/getOrderHistory', methods=['POST'])
def getOrderHistory():
    """
        Get full order history
        input json={'token': toke}
        output jason={'success': true, 'orderList': order_list}
    """
    try:
        msg = validateRequest(request.json , ["token"])
        if(msg != "OK"):
            return jsonify({"success": False, "msg" : msg}), 400

        token = request.json['token']

        tokendata = getTokenData(token)
        if bool(tokendata) == False :
            return jsonify({"success": False , "msg" : "invalid token"}), 400

        username = tokendata["username"]
        #get company from  username 
        userdata = find_one(users_ref, "username" , username , "==")
        if bool(userdata) == False:
            return jsonify({"success": False , "msg" : "invalid user"}), 400

        username = userdata["username"]
        type = userdata["type"]
        company = userdata["company"]
        if type == "employee" :
            docs = find_all(order_ref,"username",username,"==")
            return jsonify({"success": True, "orderList" : docs}), 200
        if type == "admin" :
            docs = find_all(order_ref,"company",company,"==")
            return jsonify({"success": True, "orderList" : docs}), 200
        if type == "vendor" :
            docs = find_all(order_ref,"vendor",company,"==")
            return jsonify({"success": True, "orderList" : docs}), 200

    except Exception as e:
        return f"An Error Occured: {e}"

@app.route('/getOrdersByStatus', methods=['POST'])
def getOrdersByStatus():
    """
        Get filtered order list by status
        input json={'token': token , 'status' : status}
        output jason={'success': true, 'orderList': order_list}
    """
    try:
        msg = validateRequest(request.json , ["token" , "status"])
        if(msg != "OK"):
            return jsonify({"success": False, "msg" : msg}), 400

        token = request.json['token']
        status = request.json['status']

        tokendata = getTokenData(token)
        if bool(tokendata) == False :
            return jsonify({"success": False , "msg" : "invalid token"}), 400

        username = tokendata["username"]
        #get company from  username 
        userdata = find_one(users_ref, "username" , username , "==")
        if bool(userdata) == False:
            return jsonify({"success": False , "msg" : "invalid user"}), 400

        username = userdata["username"]
        type = userdata["type"]
        company = userdata["company"]
        docs = []
        if type == "employee" :
            docs = find_all(order_ref,"username",username,"==")

        if type == "admin" :
            docs = find_all(order_ref,"company",company,"==")
            
        if type == "vendor" :
            docs = find_all(order_ref,"vendor",company,"==")

        filtered = []
        for doc in docs:
            if doc['status'] == status :
                filtered.append(doc)

        return jsonify({"success": True, "orderList" : filtered}), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@app.route('/getOrdersStat', methods=['POST'])
def getOrdersStat():
    """
        Get order status
        input json={'token': toke}
        output jason={'success': true, 'stats': stat_list}
    """
    try:
        msg = validateRequest(request.json , ["token"])
        if(msg != "OK"):
            return jsonify({"success": False, "msg" : msg}), 400

        token = request.json['token']

        tokendata = getTokenData(token)
        if bool(tokendata) == False :
            return jsonify({"success": False , "msg" : "invalid token"}), 400

        username = tokendata["username"]
        #get company from  username 
        userdata = find_one(users_ref, "username" , username , "==")
        if bool(userdata) == False:
            return jsonify({"success": False , "msg" : "invalid user"}), 400

        username = userdata["username"]
        type = userdata["type"]
        company = userdata["company"]
        docs = []
        if type == "employee" :
            docs = find_all(order_ref,"username",username,"==")

        if type == "admin" :
            docs = find_all(order_ref,"company",company,"==")
            
        if type == "vendor" :
            docs = find_all(order_ref,"vendor",company,"==")

        statList={}
        for doc in docs:
            v = ""
            if type == "vendor" :
                v = doc["company"]
            else :
                v = doc["vendor"]
            dft = { "new" : 0 , "accepted" : 0 , "rejected" : 0}
            dft[doc["status"]] = 1
            if v not in statList :
                statList[v] = dft
            else:
                statList[v][doc["status"]] += 1

        rtnList = []
        for key in statList:
            tmp = { "vendor" : key , "new" : statList[key]["new"] , "accepted" : statList[key]["accepted"] , "rejected" : statList[key]["rejected"] }
            rtnList.append(tmp)

        return jsonify({"success": True, "stats" : rtnList}), 200
        
    except Exception as e:
        return f"An Error Occured: {e}"

@app.route('/')
def rrr():
    return "SynergyCo REST service"

port = int(os.environ.get('PORT', 8080))
if __name__ == '__main__':
    app.run(threaded=True, host='0.0.0.0', port=port)
