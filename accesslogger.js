var zmq = require('zmq');

/** 
 * Sends access information over zmq to the main log processor.
 */

function AccessLogger(zmq_address) {
    this.socket = zmq.socket('push');
    this.socket.setsockopt(zmq.ZMQ_HWM, 65536);
    this.socket.connect(zmq_address);
}


AccessLogger.prototype.log = function(msg) {
    this.socket.send(JSON.stringify(msg));
}

exports = module.exports = AccessLogger;
