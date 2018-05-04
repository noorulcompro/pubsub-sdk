var PubNub = require("pubnub");

function Pubsub(options) {
    this.options = options;
    this._handlers = {};
};

Pubsub.prototype._addListener = function() {
    this.pubnub.addListener({
        status: data => this.emit("status", data),
        message: data => this.emit(data.subscribedChannel, data),
        presence: data => this.emit("presence", data)
    });
};

Pubsub.prototype.init = function() {
    this.pubnub = new PubNub(this.options);
    this._addListener();
};

/**
 * @param  {Object} options  { channels:[], ...}
 * @param  {Object} handlers { msg: fn1, product: fn2 } 
 * @return {[type]}
 */
Pubsub.prototype.subscribe = function(options, handlers = {}) {
    this.pubnub.subscribe(options);
    //if there is not any handler simply returns
    if (JSON.stringify(handlers) === "{}") return;
    for (var ch of options.channels) {
    	this._handlers[ch] = handlers[ch];
    }
};

Pubsub.prototype.on = function(channel, handler){
	this.pubnub.subscribe({ channel });
	this._handlers[channel] = handler;
};

Pubsub.prototype.emit = function(channel, ...data){
	this._handlers[channel] && this._handlers[channel].apply(null, data);
};

Pubsub.prototype.publish = function(options, cb=console.log){
	this.pubnub.publish(options, cb);
}