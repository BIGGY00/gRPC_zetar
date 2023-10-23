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

module.exports = { numbermanipulation_proto, grpc };