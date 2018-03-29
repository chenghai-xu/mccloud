#!/bin/bash
source '/opt/geant4/10.2.p03/install/bin/geant4.sh'
'/home/xuchd/opt/tsimpit/bin/simpit' -e=config.json.mac >verify.out 2>&1
