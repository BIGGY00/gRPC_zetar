const PROTO_PATH = "./reimbursement.proto";
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
const reimbursement_proto = grpc.loadPackageDefinition(packageDefinition);

module.exports = { reimbursement_proto, grpc };