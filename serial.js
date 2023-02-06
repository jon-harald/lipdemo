const lip = require('./lip.js');
const utils = require ("./utils.js");

const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

const port = process.argv[2];
const baudrate = process.argv[3];

if (!port || !baudrate) {
  console.log("Error: Missing parameters.");
  console.log(`Usage: node ${process.argv[1]} <port> <baudrate>`);
  process.exit(1);
}

// TODO Få port og baudrate fra parametre
const serialport = new SerialPort({
  path: port,
  baudRate: parseInt(baudrate),
});

const parser = serialport.pipe(new ReadlineParser({ delimiter: "\n" }));

function initializeRadio() {
    // Set PID 10 (LIP) to be delivered til PEI port
    setTimeout(function () {
        serialport.write("AT+CTSP=1,3,10\r", function (err) {
          if (err) {
            return console.log("Error on write: ", err.message);
          }
          console.log("Radio initilized");
        });
      }, 500);
}

// Open errors will be emitted as an error event
serialport.on("error", function (err) {
  console.log("Serialport error: ", err.message);
});

nextline = 0;
parser.on("data", function (data) {
  if (nextline >= 1) {
    if ((recvdCommand == "sds")) {
      let pid = utils.hex2int(data.substr(0, 2));
    
      if (pid === 10) {
        // PID 10 = LIP, discard SDS with other PIDs
        report = lip.decodeMessage(data);

        console.log(`\nLat: ${report.latitude}`);
        console.log(`Lon: ${report.longitude}`);
        console.log(`Speed: ${report.speed}`);
        console.log(`Direction: ${report.direction} degrees`);
        console.log(`Error: ${report.error}`);
        console.log(`Age: ${report.age}`);
        console.log(`Reason: ${report.reason}`);
      }
    }
    nextline = nextline - 1;
  }
  if (data.substr(0, 8) === "+CTSDSR:") {
    dataCommand = data.substr(9).split(",");
    console.log("\n---------------------------------")
    console.log(`Message from: ${dataCommand[1]}`);
    console.log(`Message to: ${dataCommand[3]}`);
    console.log(`Time:  ${new Date()}`);

    lastMessageFrom = dataCommand[1];
    recvdCommand = "sds";
    nextline = 1;
  } else if (data.substr(0, 2) === "OK") {
    console.log("Response OK to command");
    waitingForOK = false;
  }

});

initializeRadio ();