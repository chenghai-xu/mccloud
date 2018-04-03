#!/bin/bash
rm *.dist *.phase *.out *.mesh *.trj *~ .*
exec >verify.out 2>&1
source $1
$2
