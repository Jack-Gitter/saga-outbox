"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryStep = void 0;
class InventoryStep {
    constructor(rabbitMQService, message) {
        this.rabbitMQService = rabbitMQService;
        this.message = message;
    }
    async invoke() {
        console.debug('invoking inventory step!');
        await this.rabbitMQService.sendInventoryCheckMessage(this.message.product, this.message.quantity);
    }
    async rollback() {
        console.debug('invoking inventory rollback!');
    }
}
exports.InventoryStep = InventoryStep;
//# sourceMappingURL=orders.inventory.step.js.map