# tool path from root
$buf = "third_party/buf/buf.exe"
$_buf = "../$buf"

# configure buf
&$_buf mod update

# go to root
Push-Location ..

# listing target .proto files
Write-Output "> target .proto files:"
&$buf ls-files

# remove generated files
Write-Output "> removing..."
if (Test-Path ./gen/go) {
  Remove-Item -Path ./gen/go -Recurse -Force
}

# compiles all .proto files
Write-Output "> building..."
&$buf build
if (!$?) {
  Write-Error "-> failure"
  Pop-Location
  exit
}

# generate protobuf files
Write-Output "> generating..."
&$buf generate
if (!$?) {
  Write-Error "-> failure"
  Pop-Location
  exit
}

# update modules
go mod tidy

# success
Write-Output "-> succeeded!"

# back to proto
Pop-Location
exit