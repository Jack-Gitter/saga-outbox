* We have inventory sevice putting outbox messages for both remove and reserve?



# Problems overcame

* order is created, but no message is sent out in the beginning
    * outbox pattern!
* in memeory representation of saga -- when the app crashes, have to recreate these somehow for sagas that have kicked off already!
* race conditions for sagas when you simply send a message then are waiting on a channel and then assume that message belongs to that saga
    * in many cases, if multiple sagas are at that step and are waiting, then you could recieve another sagas message!
    * need to have one message handler in this case, and dispatch the corresponding events to the event handler for the message
* need to know what to send in the next step -- if we're not storing the saga and its "steps" in memory, how?
    * need to either use the pending order, the message response, or something else to figure out what to send to the next service
* different inboxes for different messages, can have conflicting ids!
