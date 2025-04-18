"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingStep = void 0;
class ShippingStep {
    constructor(rabbitMQService, message) {
        this.rabbitMQService = rabbitMQService;
        this.message = message;
    }
    async invoke() {
        console.debug('invoking shipping step!');
        await this.rabbitMQService.sendShippingMessage(this.message.product, this.message.quantity);
    }
    async rollback() {
        console.debug('invoking shipping rollback!');
    }
}
exports.ShippingStep = ShippingStep;
//# sourceMappingURL=orders.shipping.step.js.map