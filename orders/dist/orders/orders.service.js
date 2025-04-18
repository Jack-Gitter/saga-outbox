"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const orders_entity_1 = require("./orders.entity");
const orders_outbox_entity_1 = require("./orders.outbox.entity");
const orders_orchestrator_1 = require("./saga/orders.orchestrator");
const orders_inventory_step_1 = require("./saga/orders.inventory.step");
const rabbitmq_orders_1 = require("./rabbitmq/rabbitmq.orders");
const orders_shipping_step_1 = require("./saga/orders.shipping.step");
let OrdersService = class OrdersService {
    constructor(dataSource, rabbitMQ) {
        this.dataSource = dataSource;
        this.rabbitMQ = rabbitMQ;
    }
    onModuleInit() {
        this.pollOrderOutbox();
    }
    async initiateOrder(product, quantity) {
        await this.dataSource.transaction(async (entityManager) => {
            await entityManager.save(new orders_entity_1.Order(product, quantity));
            await entityManager.save(new orders_outbox_entity_1.OrdersOutboxMessage(product, quantity));
        });
    }
    async pollOrderOutbox() {
        setInterval(async () => {
            const orderOutboxRepository = this.dataSource.getRepository(orders_outbox_entity_1.OrdersOutboxMessage);
            const outboxMessages = await orderOutboxRepository.find();
            console.debug('found messages!');
            console.debug(outboxMessages);
            const orchestrators = outboxMessages.map((message) => this.constructOrchestrator(message));
            await Promise.all(orchestrators.map(async (orchestrator) => {
                await orchestrator.begin();
            }));
            await orderOutboxRepository.remove(outboxMessages);
        }, 5000);
    }
    constructOrchestrator(message) {
        const inventoryStep = new orders_inventory_step_1.InventoryStep(this.rabbitMQ, message);
        const shippingStep = new orders_shipping_step_1.ShippingStep(this.rabbitMQ, message);
        return new orders_orchestrator_1.OrdersSagaOrchestrator([inventoryStep, shippingStep]);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        rabbitmq_orders_1.RabbitMQService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map