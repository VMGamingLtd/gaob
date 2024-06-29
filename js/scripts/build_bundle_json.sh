#!/bin/bash
set -xe

npx pbjs -t json \
  ../../src/MessageHeader.proto \
  ../../src/StringMessage.proto \
  ../../src/Authenticate.proto \
  > ../src/bundle.json
echo "created ../src/bundle.json"
