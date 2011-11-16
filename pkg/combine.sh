#!/bin/sh
VERSION=BETA_0.7.3

git tag -f ${VERSION}

mkdir -f output
FILE_NAME=output/${VERSION}.combined

for FILE in ../src/downloaded/*
do
  cat $FILE >> ${FILE_NAME}
done

