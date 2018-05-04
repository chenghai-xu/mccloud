#!/bin/bash

#https://developers.google.com/closure/compiler/?csw=1
#https://stackoverflow.com/questions/194397/how-can-i-obfuscate-protect-javascript

files=$(find collected_static/mc collected_static/home | grep '\.js')
for file in $files
do
   echo $file
   java -jar closure-compiler/closure-compiler.jar --js "$file" --js_output_file "$file.tmp" && mv "$file.tmp" "$file"
done
