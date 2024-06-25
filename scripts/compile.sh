#!/bin/bash
set -xe

#PROTOC_CMD=../../protoc/protoc 
PROTOC_CMD=/c/w1/cpackages/bin/protoc 

SRC_DIR=../src
DST_DIR=../build
DST_DIR_CSHARP=../build_csharp

HEADERS_DIR=../../vcpkg/installed/x64-windows/include

if [ ! -d $DST_DIR ]; then
	mkdir $DST_DIR
fi;
rm -rf $DST_DIR/*

if [ ! -d $DST_DIR_CSHARP ]; then
	mkdir $DST_DIR_CSHARP
fi;
rm -rf $DST_DIR_CSHARP/*



$PROTOC_CMD -I=$SRC_DIR -I=$HEADERS_DIR --cpp_out=$DST_DIR --csharp_out=$DST_DIR_CSHARP  $SRC_DIR/*.proto
