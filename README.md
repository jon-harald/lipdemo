Short demo program to show how location reports in short LIP format from Tetra radios can be received av decoded.

The program is only tested on Motorola terminals. In theory receiving location reports from any manufacturer should 
work, but the the AT commands to get the SDS delivered to the PEI port and the format of the SDS data on the on the 
receiving terminal would probably have to be slightly modified. 

The program only accounts for the short LIP format.

References:
Motorola AT Programmers guide  (not publicly avaliable)
Sepura MOD-13-1615             (not publicly avaliable)
ETSI document TS 100 392-18-1  https://www.etsi.org/deliver/etsi_ts/100300_100399/1003921801/01.03.01_60/ts_1003921801v010301p.pdf

The program should work under all OSes supported by Node Serialport but has only been tested on MacOS. 
Node.js mst be installed, and Node Serial package can sometimes be a bit problematic to compile. 
Please see the documentaion in https://serialport.io if you have any problems. 

Usage:

To only decode a single SDS with short LIP PDU you can use "node deocde.js <message>" e.g. 

    $ node decode.js 0A1082704AA9E02A020810
    Lat: 59.9304735660553
    Lon: 11.464329957962036
    Speed: 1
    Direction: 0 degrees
    Error: <200 m
    Age: 01
    Reason: Interval

To connect to PEI interface on the terminal and decode received LIP reports use serial.js like this:

node serial.js <port> <baudrate>  e.g. node serial.js /dev/tty.usbserial-FTDN0YWQ 38400

    node serial.js /dev/tty.usbserial-FTDN0YWQ 38400
    Radio initilized
    Response OK to command

    ---------------------------------
    Message from: 6101626
    Message to: 6117016


    Lat: 59.93049502372742
    Lon: 11.464190483093262
    Speed: 2
    Direction: 0 degrees
    Error: < 200 m
    Age: <5 min
    Reason: Status

    ---------------------------------
    Message from: 6101626
    Message to: 6117016


    Lat: 59.93039846420288
    Lon: 11.464426517486572
    Speed: 1
    Direction: 0 degrees
    Error: < 200 m
    Age: <5 min
    Reason: Interval

Available serial ports can be listed with "node listserialports.js"