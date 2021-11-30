import {SimpleGateway} from "@tmorin/ceb-messaging-simple";
import {assert} from "chai"
import {PurifyGateway} from "./gateway";
import {PurifyCommandBus} from "./command";
import {PurifyQueryBus} from "./query";

describe("PurifyGateway", function () {
    let simpleGateway: SimpleGateway
    let purifyGateway: PurifyGateway
    before(function () {
        simpleGateway = SimpleGateway.create()
        purifyGateway = new PurifyGateway(
            new PurifyCommandBus(simpleGateway.commands),
            new PurifyQueryBus(simpleGateway.queries),
            simpleGateway.events,
            simpleGateway.observer
        )
    })
    after(async function () {
        await simpleGateway.dispose()
    })
    it("should provide resources", function () {
        assert.ok(purifyGateway.commands)
        assert.ok(purifyGateway.queries)
        assert.ok(purifyGateway.events)
        assert.ok(purifyGateway.observer)
    })
});
