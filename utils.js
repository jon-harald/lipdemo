
exports.hex2bin = function (hex) {
    let bin = "";
    let bitsInHex = 4;
  
    Array.from(hex).forEach(
      function (char) {
        let currentBin = parseInt(char, 16).toString(2);
  
        if (currentBin.length < bitsInHex) {
          let padding = "0".repeat(bitsInHex-currentBin.length);
          currentBin = padding + currentBin;
        }
  
        bin += currentBin;
      }
    );
  
    return bin;
}

exports.hex2int = function (hex) {
  return parseInt(hex, 16);
}

exports.hex2a = function(hex) {
  let hexString = hex.toString(); //force conversion
  let str = "";
  for (var i = 0; i < hexString.length; i += 2)
    str += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
  return str;
}

return module.exports;
