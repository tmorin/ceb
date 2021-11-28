import {Either, EitherAsync, Maybe, Nothing} from "purify-ts";
import {
    ExecuteActionOptions,
    MessageBuilder,
    Query,
    QueryBus,
    Removable,
    Result,
    ResultHeaders
} from "@tmorin/ceb-messaging-core";

export type PurifyQueryResult<B = any> = Promise<Either<Error, Maybe<B>>>;

export type PurifyQueryOutput<B = any> = EitherAsync<Error, Maybe<B>>;

export interface PurifyQueryHandler<Q extends Query = Query, B = any> {
    (query: Q): PurifyQueryOutput<B>;
}

export class PurifyQueryBus {
    constructor(private readonly queryBus: QueryBus) {
    }

    execute<B = any, Q extends Query = Query, R extends Result<B> = Result>(
        query: Q,
        options?: Partial<ExecuteActionOptions>
    ): PurifyQueryResult<B> {
        return EitherAsync<Error, Maybe<B>>(() =>
            this.queryBus
                .execute<R, Q>(query, options)
                .then((result) => result.body)
                .then((body) => Maybe.fromNullable(body))
        ).run();
    }

    handle<Q extends Query = Query, B = any, R extends Result<B> = Result>(
        queryType: string,
        handler: PurifyQueryHandler<Q, B>
    ): Removable {
        return this.queryBus.handle<Q, R>(queryType, (query) => {
            const p = handler(query)
                .map((maybe) => {
                    return maybe.map((body) =>
                        MessageBuilder.result<B, ResultHeaders, R>(query).body(body).build()
                    );
                })
                .run()
                .then((either) => {
                    if (either.isLeft()) {
                        const error = either.swap().extract();
                        throw error;
                    }
                    return either
                        .orDefaultLazy(() => Nothing)
                        .orDefaultLazy(() =>
                            MessageBuilder.empty<B, ResultHeaders, R>(query).build()
                        );
                });
            return p;
        });
    }
}
