const PROTO_PATH = "./reimbursement.proto";
const OPTIONS = {
  keepCase: true, // instructs the protoLoader to maintain protobuf field names. 
  longs: String, // longs and enums store the data types that represent long and enum values
  enums: String,
  defaults: true, // when set to true, sets default values for output objects. 
  oneofs: true,  // sets virtual oneof properties to field names. 
};

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, OPTIONS);
const reimbursement_proto = grpc.loadPackageDefinition(packageDefinition);


function onCalculateReimbursement(call, callback) {
  let totalPrice = call.request.price
  if (call.request.type == "opd" && call.request.insurance == "samsung_life") {
    console.log("Found samsung life on OPD got discount 10%")
    totalPrice = totalPrice - (totalPrice * 0.10)
  }
  else if (call.request.type == "ipd" && call.request.insurance == "aia_vitality") {
    console.log("Found AIA vitality on IPD got discount 20%")
    totalPrice = totalPrice - (totalPrice * 0.20)
  }
  else if (call.request.type == "er" && call.request.insurance == "fwd") {
    console.log("Found FWD on ER got discount 30%")
    totalPrice = totalPrice - (totalPrice * 0.30)
  }
  
  callback(null, {
    totalPrice: totalPrice,
  })
}

const server = new grpc.Server();
server.addService(reimbursement_proto.Reimbursement.service, {
  calculateReimbursement: onCalculateReimbursement,
})

server.bindAsync(
  `0.0.0.0:${process.env.PLUGIN_PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => { 
    console.log(`Server start at 0.0.0.0:${process.env.PLUGIN_PORT}`)
    server.start(); 
  }
)


