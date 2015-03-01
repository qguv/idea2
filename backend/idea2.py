#!/usr/bin/env python2
# vim: nu ai ts=8 et sw=4 sts=4

from flask import Flask, request
from json import loads, dumps
import redis

app = Flask(__name__)
store = redis.StrictRedis(host="localhost", port=6379, db=0)

@app.route("/hello_world")
def hello():
    return "Hello World!"

@app.route("/u/<user>", methods=["GET", "POST"])
def user_route(user):

    # GET
    if request.method == "GET":
        return lists(user)

    # POST
    listname = request.headers["name"]
    links = loads(request.headers["links"])
    return newlist(user, listname, links)

@app.route("/u/<user>/<listname>", methods=["GET", "POST", "DELETE"])
def user_listname_route(user, listname):

    # GET
    if request.method == "GET":
        return links(user, listname)

    # POST
    elif request.method == "POST":
        rename = request.headers["rename"]
        return mvlist(user, listname, rename)

    # DELETE
    else:
        return rmlist(user, listname)

def newlist(user, listname, links):

    # append the listname to the list of listnames
    store.lrem(user, 0, listname)
    store.lpush(user, listname)

    # store the actual list
    lk = listkey(user, listname)
    store.delete(lk)
    store.lpush(lk, *links)

    return "Okay! New list for user {} with name {} looks like {}.".format(user, listname, store.lrange(listkey(user, listname), 0, -1))

def lists(user):
    return dumps(store.lrange(user, 0, -1))

def rmlist(user, listname):
    
    # replace the listname in the list of listnames
    store.lrem(user, 0, listname)

    # remove the actual list
    store.delete(listkey(user, listname), links)

    return "Okay! Good bye {} under user {}.".format(listname, user)

def mvlist(user, listname, rename):

    # store the list under a different key
    store.rename(listkey(user, listname), listkey(user, rename))
    store.lpush(user, rename)

    return "Okay! {} is now at {}, still under user {}.".format(listname, rename, user)

def links(user, listname):
    return dumps(store.lrange(listkey(user, listname), 0, -1))

def listkey(*pieces):
    return ':'.join(pieces)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80, debug=True)
