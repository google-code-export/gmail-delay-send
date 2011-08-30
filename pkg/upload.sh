#!/bin/sh -x

PROJECT="gmail-delay-send"
USER="blairkutz@gmail.com"
ENV=dev

FILE_NAME="output/${PROJECT}.${ENV}"

echo "Combining and uploading files for $ENV"

rm -f ${FILE_NAME}
touch ${FILE_NAME}

for FILE in ../src/*
do
  cat $FILE >> ${FILE_NAME}
done

python utils/googlecode_upload.py -s "Uploading for $ENV" -p "${PROJECT}" -u "${USER}" ${FILE_NAME}
