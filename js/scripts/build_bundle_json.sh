#!/bin/bash
set -xe

npx pbjs -t json \
  ../../src/MessageHeader.proto \
  > ../src/bundle.json
echo "created ../src/bundle.json"
