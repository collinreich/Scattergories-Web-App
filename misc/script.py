#Script for converting txt file to JSON
import json

myDictionary = {}

with open('Scattergories.txt') as f:
    lines = f.readlines()
i = 0
for line in lines:
    line = line.rstrip()
    myDictionary[i] = line
    i += 1

out_file = open("categories.json", "w")
json.dump(myDictionary,out_file)
out_file.close()