import {EitherAsync, Maybe} from "purify-ts";
import {
    Command,
    CommandBus,
    Event,
    ExecuteActionOptions,
    MessageBuilder,
    Removable,
    Result,
    ResultHeaders
} from "@tmorin/ceb-messaging-core";

export type PurifyCommandResultAsync<B = any> = EitherAsync<Error, Maybe<B>>;

export type PurifyCommandOutput<B = any, Es extends Array<Event> = []> = {
    result: Maybe<B>;
    events: Maybe<Es>;
};

export type PurifyCommandOutputAsync<B = any,
    Es extends Array<Event> = []> = EitherAsync<Error, PurifyCommandOutput<B, Es>>;

export interface PurifyCommandHandler<C extends Command = Command,
    B = any,
    Es extends Array<Event> = []> {
    (command: C): PurifyCommandOutputAsync<B, Es>;
}

export function createPurifyCommandOutput<B = any,
    Es extends Array<Event> = []>(data: Partial<PurifyCommandOutput<B, Es>> = {}): PurifyCommandOutput<B, Es> {
    return {
        result: Maybe.zero(),
        events: Maybe.zero(),
        ...data
    };
}

export class PurifyCommandBus {
    constructor(private readonly commandBus: CommandBus) {
    }

    execute<B = any, C extends Command = Command, R extends Result<B> = Result>(
        command: C,
        options?: Partial<ExecuteActionOptions>
    ): PurifyCommandResultAsync<B> {
        return EitherAsync<Error, Maybe<B>>(() =>
            this.commandBus
                .execute<R, C>(command, options)
                .then((result) => result.body)
                .then((body) => Maybe.fromNullable(body))
                .then((maybe) => maybe)
        );
    }

    executeAndForget<C extends Command = Command>(command: C): void {
        this.commandBus.executeAndForget(command);
    }

    handle<C extends Command = Command,
        B = any,
        Es extends Array<Event> = [],
        R extends Result<B> = Result>(commandType: string, handler: PurifyCommandHandler<C, B, Es>): Removable {
        return this.commandBus.handle<C, R, Es>(commandType, (command) => {
            const p = handler(command)
                .map((output) => {
                    const result = output.result
                        .map((body) =>
                            MessageBuilder.result<B, ResultHeaders, R>(command)
                                .body(body)
                                .build()
                        )
                        .extract();
                    const events = output.events.extract();
                    return {
                        result,
                        events
                    };
                })
                .run()
                .then((either) => {
                    if (either.isLeft()) {
                        const error = either.swap().extract();
                        throw error;
                    } else if (either.isRight()) {
                        const result = either.extract();
                        return result;
                    }
                });
            return p;
        });
    }
}
