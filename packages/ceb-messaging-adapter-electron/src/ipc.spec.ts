import {assert} from "chai"
import {ipcRenderer} from 'electron'
import {SimpleGatewaySymbol, SimpleModule} from "@tmorin/ceb-messaging-simple";
import {ContainerBuilder} from "@tmorin/ceb-inversion-core";
import {Command, GatewaySymbol, MessageBuilder, Result} from "@tmorin/ceb-messaging-core";
import {ElectronModule} from "./inversion";
import {IpcRendererGateway} from "./ipc-renderer";

describe("ceb-messaging-adapter-electron/ipc", function () {
    this.timeout(10000)
    let ipcRendererGateway: IpcRendererGateway
    before(async () => new Promise((resolve, reject) => {
        ipcRenderer.once("main-ready", () => {
            ContainerBuilder.get()
                .module(new SimpleModule({gatewayRegistryKey: SimpleGatewaySymbol}))
                .module(new ElectronModule())
                .build()
                .initialize()
                .then(container => {
                    ipcRendererGateway = container.registry.resolve<IpcRendererGateway>(GatewaySymbol)
                    resolve()
                })
                .catch(reject)
        })
        ipcRenderer.on("main-log", (evt, message) => {
            console.info(message)
        })
    }))
    it("should publish and subscribe to events", function (done) {
        ipcRendererGateway.events.subscribe("FromMainEvent", (message) => {
            assert.ok(message)
            done()
        })
        const event = MessageBuilder.event("FromRendererEvent").body("Hello World!").build()
        ipcRendererGateway.events.publish(event)
    })
    describe("from Renderer to Main", function () {
        it("should execute command", async function () {
            const commandA = MessageBuilder.command("CommandA").body("World").build()
            const resultA = await ipcRendererGateway.commands.execute<Result<string>>(commandA)
            assert.ok(resultA)
            assert.equal(resultA.body, "Hello, World!")
        })
    })
    describe("from Main to Renderer", function () {
        it("should execute command", function (done) {
            ipcRendererGateway.commands.handle<Command<string>, Result<string>>("CommandB", async (command) => {
                const result = MessageBuilder.result<string>(command).body(`Hello, ${command.body}!`).build()
                return {result}
            })
            ipcRenderer.on("execute-CommandB-ok", () => done())
            ipcRenderer.on("execute-CommandB-ko", (_, error) => done(error))
            ipcRenderer.send("execute-CommandB")
        })
    })
})
