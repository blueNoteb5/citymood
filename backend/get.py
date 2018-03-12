#!/usr/bin/python
# -*- coding: UTF-8 -*-

import json
import cgi
import city
from main import CITIES

FORM = cgi.FieldStorage()

DESIRED_CITY = FORM.getvalue("city")

try:
    OBJ = ([city for city in CITIES if city.name.lower() == DESIRED_CITY.lower()][0])
except Exception:
    print "Content-Type: application/json"
    print
    print json.dumps({"data" : "There's nothing here!!"})

OBJ.print_mood("2017-12-07")

OBJ_AS_DICT = {'City' : OBJ.name,
               'Hashtag' : OBJ.print_hashtags(),
               'Mood' : OBJ.get_array_of_moods()}

print "Content-Type: application/json"
print
print json.dumps(OBJ_AS_DICT)
