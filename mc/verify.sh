#!/bin/bash
source '/opt/geant4/10.2.p03/install/bin/geant4.sh'
'/opt/tsimpit/0.9/bin/simpit' -e=config.json.mac >verify.out 2>&1
