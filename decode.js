// Dekoder LIP PDU gitt som argument, f.eks. "node decode.js 0A1082704AA9E02A020810"

const lip = require('./lip.js');

const message = process.argv[2];

const report = lip.decodeMessage(message); 

console.log(`Lat: ${report.latitude}`);
console.log(`Lon: ${report.longitude}`);
console.log(`Speed: ${report.speed}`);
console.log(`Direction: ${report.direction} degrees`);
console.log(`Error: ${report.error}`);
console.log(`Age: ${report.age}`);
console.log(`Reason: ${report.reason}`);