# tool path from root
buf="third_party/buf/buf"
_buf="../$buf"

# configure buf
$_buf dep update

# go to root
pushd ..

# listing target .proto files
echo "> target .proto files:"
$buf ls-files

# remove generated files
echo "> removing..."
if [ -e ./gen/go ]; then
  rm -Rf ./gen/go
fi

# compiles all .proto files
echo "> building..."
$buf build
if [ ! $? ]; then
  echo "-> failure"
  popd
  exit
fi

# generate protobuf files
echo "> generating..."
$buf generate
if [ ! $? ]; then
  echo "-> failure"
  popd
  exit
fi

# update modules
go mod tidy

# success
echo "-> succeeded!"

# back to proto
popd
exit