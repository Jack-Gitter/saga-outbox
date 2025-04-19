*  Add the last step, setting the order to confirmed status
* Make sure that rabbitmq only sends an ack back after our callback is complete, and make sure that we're enqueuing the next step before ack is sent for prev step
* run through the saga and verify that it is operating as expecteda
