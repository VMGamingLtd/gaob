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
