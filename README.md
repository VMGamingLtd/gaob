# Gao Protocol Buffres 

This repository contain protocol buffers definitions used across projects.

## Install Protocol Buffers For C++ On Windows 

Install protobuf C++ headers and libs (windows only):

```
> /c/w1/vcpkg/vcpkg install protobuf:x64-windows

```

Download [protoc binary protoc-3.21.12-windows-x86_64.exe](https://repo1.maven.org/maven2/com/google/protobuf/protoc/3.21.12/) (windows only).
Place executable in folder `/w1/protoc/` an rename it to `protoc.exe` so that full filepath name is  `/w1/protoc/protoc.exe` (windows only).

Binary protoc binary version and vcpkg packahe `protobuf:x64-windows` version must match!!!
To check installed vcpkg version of protobuf run (windows only):

```
> /c/w1/vcpkg/vcpkg list protobuf
```

Compile protocol buffers:

```
> cd scripts
> ./compile.sh
```

Update protocol buffers in gaow and gao projects:


```
> cd scripts
> ./proto_models_update_gaow.sh
```

## Building protobuf on windows

Open `x64 Naitive Tools Command Prompt for VS 2022`,

Build and install `abseil`:

```
> cd /c/w1/build
> git clone https://github.com/abseil/abseil-cpp.git
> cd abseil-cpp
> git checkout f04e489056d9be93072bb633d9818b1e2add6316
> mkdir ../abseil-cpp_build
> cd ../abseil-cpp_build
> cmake ../abseil-cpp -DCMAKE_INSTALL_PREFIX=/w1/cpackages -DABSL_PROPAGATE_CXX_STD=ON
> cmake --build . --config Release
> cmake --install . --config Relese --prefix /w1/cpackages

```

Build and install `protobuf`:

```
> cd /c/w1/build
> git clone https://github.com/protocolbuffers/protobuf.git
> cd protobuf
> git checkout v3.21.12
> git submodule update --init --recursive
> mkdir ../protobuf_build
> cd ../protobuf_build
> cmake ../protobuf -DCMAKE_CXX_STANDARD=14 -DCMAKE_INSTALL_PREFIX=/w1/cpackage 
> cmake --build . --config Release 
> cmake --install . --config Release --prefix "/w1/cpackages"
```

## Install Protocol Buffers For C# On Windows 


Clone repository:

```
> cd /c/w1
> git clone https://github.com/protocolbuffers/protobuf.git
```

Checkout version `3.21.12` (version must be same as the C++ protobuf version)

```
> cd /c/w1/protobuf
> git checkout v3.21.12
```

Remove `Google.Protobuf` from project `gao` if previously installed.

```
> rm -rf ../gao/Assets/Scripts/Google.Protobuf
```

Copy `Google.Protobuf` to project `gao`:

```
> cd /c/w1/protobuf
> cp -r csharp/src/Google.Protobuf ../gao/Assets/Scripts/ 
> rm -r ../gao/Assets/Scripts/Google.Protobuf/obj
> rm -r ../gao/Assets/Scripts/Google.Protobuf/bin
```

Unity does not comopile `Google.Protobuf`. To compile it you need to add [System.Runtime.CompilerServices.Unsafe](https://www.nuget.org/packages/System.Runtime.CompilerServices.Unsafe) NuGet to Unity.
E.g you can copy `dll` inside `../gao/Assets/CompilerServicesUnsafe`


```
> ls -l ../gao/Assets/CompilerServicesUnsafe/System.Runtime.CompilerServices.Unsafe.dll 
../gao/Assets/CompilerServicesUnsafe/System.Runtime.CompilerServices.Unsafe.dll*
```

After installing `System.Runtime.CompilerServices.Unsafe.dll` you will have to check `Allow unsafe Code` checkbox in menu `Edit > Project Settings > Player` in `Other Settings` section. 

`Google.Protobuf` should compile ok in Unity now.

## Build and update protobuf model stubs in gao and gaow projects.

Build protobuf model stubs:
```
> cd /c/w1/gaob/scripts
> ./compile.sh 
```

Update protobuf model stubs in `gao` and `gaow` projects:
```
> /c/w1/gaob/scripts
> ./protobuf_models_update.sh
```


