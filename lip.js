// Dekoder SDS med Short LIP PDU
// Se ETSI TS 100 392-18-1 

const utils = require('./utils');

// Terminalen har mange triggere for å sende posisjon, settes i CPS.
// Intervall og distanse er mest vanlig. Distanse har miniumsverdi på 100 meter.
// Terminalen vil aldri sende oftere enn 10 sekunder, heller ikke om flere triggere utløses
const reasonsForSending = {
    0: "Power on",
    1: "Power off",
    2: "Emergency",
    3: "PTT",
    4: "Status",
    5: "TXI on",
    6: "TXI off",
    7: "TMO on",
    8: "DMO on",
    9: "Enter service",
    10: "Service loss (restored)",
    11: "Serving cell changed",
    12: "low battery",
    13: "CarKit connected",
    14: "CarKit disconnected",
    129: "Interval",
    130: "Distance"
}

const directionOfTravelLookup = {
    '0000': 0,
    '0001': 22.5,
    '0010': 45,
    '0011': 67.5,
    '0100': 90,
    '0101': 112.5,
    '0110': 135,
    '0111': 157.5,
    '1000': 180,
    '1001': 202.5,
    '1011': 247.5,
    '1100': 270,
    '1101': 292.5,
    '1110': 315,
    '1111': 337.5
}


function getSpeedInKmH (binaryVelocity) {
    const decimalVelocity = parseInt(binaryVelocity, 2);

    if (decimalVelocity == 127) {
        return "unknown"
    } else if (decimalVelocity >= 29)  {
        return 16*(1+0.038)**(decimalVelocity-13) + 0
    } else {
        return decimalVelocity.toString();
    }
}


const positionErrorLookup = {
    '000': '< 2 m',
    '001': '< 20 m',
    '010': '< 200 m',
    '011': '< 2 km',
    '100': '< 20 km',
    '101': '<= 200 km',
    '110': '> 200 km',
    '111': 'Unkown',
}

const timeElapsedLookup = {
    '0': '< 5 s',
    '1': '<5 min',
    '2': '< 30 m',
    '3': 'Unknown or N/A',
}

exports.decodeMessage = function(message) {
    // To første byte er PID i hex. LIP har PID = 10
    const pid = parseInt(message.substring(0,2), 16);

    debugger
    if (pid !== 10) {
        throw new Error('Trying to decode LIP message with unsupported PID');
    }

    // Resten av meldingsdata er LIP. Tar kun og dekoder short LIP pakke her.
    // Long LIP har flere datafelter, men brukes sjeldnere da datamengden som skal sendes
    // er vesentlig større. 
    const lipHex = message.substring(2);
    const lipBinary = utils.hex2bin(lipHex);

    // Short LIP, se ETSI TS 100 392-18-1
    const pduType               = lipBinary.substring(0,2);
    const timeElapsed           = lipBinary.substring(2,4);
    const longitude             = lipBinary.substring(4,29);
    const latitude              = lipBinary.substring(29,53);
    const positionError         = lipBinary.substring(53,56);
    const horisontalVelocity    = lipBinary.substring(56,63);
    const directionOfTravel     = lipBinary.substring(63,67);
    const typeOfAdditionalData  = lipBinary.substring(67,68);
    const additionalData        = lipBinary.substring(68,76);

    // se ETSI TS 100 392-18-1, fungerer kun for nordlig og østlig lengde og breddegrad (ser bort fra toerkomplement her).  
    const longDec = parseInt(longitude, 2) * 0.0000107288360595703125;  
    const latDec = parseInt(latitude, 2) * 0.0000107288360595703125;

    let reasonForSending = "Not reported";
    if (typeOfAdditionalData == '0') {
        reasonForSending = reasonsForSending[parseInt(additionalData, 2)] ?? `Unkown reason (${parseInt(additionalData, 2)})`;
    } 

    let report = {
        'latitude' : latDec,
        'longitude' : longDec,
        'speed' : getSpeedInKmH(horisontalVelocity),
        'age' : timeElapsedLookup[parseInt(timeElapsed, 2)],
        'direction' : directionOfTravelLookup[directionOfTravel],
        'error': positionErrorLookup[positionError],
        'reason' : reasonForSending,
    }

    return report;
}

return module.exports;