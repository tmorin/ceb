import {
    Bus,
    ExecutionHandler,
    Handler,
    MessageAction,
    MessageConstructor,
    MessageEvent,
    MessageHeaders,
    MessageKind,
    MessageResult,
    SubscribeOptions,
    Subscription,
    SubscriptionListener
} from "@tmorin/ceb-messaging-core";

export class NotImplementedBus implements Bus {

    public subscribeCalls: Array<[any, any, any]> = []

    publish<E extends MessageEvent<any, MessageHeaders>>(event: E): Promise<void> {
        throw new Error("Method not implemented.");
    }

    subscribe<E extends MessageEvent<any, MessageHeaders>>(EventType: string | MessageConstructor<E>, listener: SubscriptionListener<E>, options?: SubscribeOptions): Subscription {
        this.subscribeCalls.push([EventType, listener, options])
        return {
            unsubscribe() {
            }
        }
    }

    execute<A extends MessageAction<any, MessageHeaders>, R extends MessageResult<any, MessageHeaders>>(action: any, ResultType?: any, options?: any): Promise<void> | Promise<R> {
        throw new Error("Method not implemented.");
    }

    handle<A extends MessageAction<any, MessageHeaders>, R extends MessageResult<any, MessageHeaders>>(ActionType: string | MessageConstructor<A>, ResultType: string | MessageConstructor<R>, handler: ExecutionHandler<A, R>): Handler {
        throw new Error("Method not implemented.");
    }

    emit(event: any, err?: any, ...rest: any[]): void {
        throw new Error("Method not implemented.");
    }

    on(event: any, listener: any): this {
        throw new Error("Method not implemented.");
    }

    off(event?: any, listener?: any): this {
        throw new Error("Method not implemented.");
    }

    dispose(): Promise<void> {
        throw new Error("Method not implemented.");
    }

}

export class EventA implements MessageEvent<string> {
    constructor(
        readonly body: string,
        readonly headers: MessageHeaders = {
            messageType: EventA.name,
            messageId: `${EventA.name}-${Date.now()}`
        },
        readonly kind: MessageKind = MessageKind.event,
    ) {
    }
}
