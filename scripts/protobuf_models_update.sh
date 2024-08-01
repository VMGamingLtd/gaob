#!/bin/bash
set -xe

# gaow

proto_dir=../../gaow/wsrv/protobuf

rm -rf $proto_dir
cp -r ../build $proto_dir 

# gao

proto_dir=../../gao/Assets/Scripts/Protobuf

rm -rf $proto_dir
cp -r ../build_csharp $proto_dir 

# js

(cd ../js/scripts; ./build_bundle_json.sh)
