#!/bin/bash
job=$1
src=$2
dst=$3
rm -rf $dst_file
cd $src && zip -x $job/*.sh -r $dst $job
