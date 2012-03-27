#!/bin/bash

# This isn't a real example, it just hits a few routes to make sure the API is functioning
# For the full test suite see test

curl -X POST "http://localhost:2663/minefield/levels/one/games" -d "username=itv&email=jobs@i.tv&link=https://github.com/idottv/robogames"

echo $result
