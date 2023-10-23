const PROTO_PATH = "./numbermanipulation.proto"; // Update the path to your proto file.
const OPTIONS = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, OPTIONS);
const numbermanipulation_proto = grpc.loadPackageDefinition(packageDefinition);

function onIncreaseNumberByTwo(call, callback) {
  const number = call.request.number;
  const result = number + 2;

  callback(null, { result: result });
}

const server = new grpc.Server();
server.addService(numbermanipulation_proto.NumberManipulation.service, {
  increaseNumberByTwo: onIncreaseNumberByTwo,
});

server.bindAsync(
  `0.0.0.0:${process.env.PLUGIN_PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`Server start at 0.0.0.0:${process.env.PLUGIN_PORT}`);
    server.start();
  }
);
