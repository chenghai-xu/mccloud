#!/bin/bash
job=$1
src=$2
dst=$3
dst_file="$dst/$job.zip"
rm -rf $dst_file
cd $src
zip -x $job/*.sh -r $dst_file $job
