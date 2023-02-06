const { SerialPort } = require('serialport')

async function listPorts() {
    let ports = await SerialPort.list();
    ports.forEach(port => {
        console.log(port.path)
    });
}

listPorts();