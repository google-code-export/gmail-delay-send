#!/bin/sh
VERSION=BETA_0.5

git tag -f ${VERSION}

FILE_NAME=output/${VERSION}.combined

for FILE in ../src/downloaded/*
do
  cat $FILE >> ${FILE_NAME}
done

