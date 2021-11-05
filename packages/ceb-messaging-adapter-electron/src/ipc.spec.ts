import {assert} from "chai"
import {ipcRenderer} from 'electron'
import {SimpleModule} from "@tmorin/ceb-messaging-simple";
import {Bus, BusSymbol} from "@tmorin/ceb-messaging-core";
import {CommandA, CommandB, FromMainEvent, FromRendererEvent, ResultA, ResultB} from "./__TEST/fixture";
import {ContainerBuilder} from "@tmorin/ceb-inversion";
import {ElectronModule} from "./inversion";

describe("IPC", function () {
    this.timeout(5000)
    let ipcRendererBus: Bus
    before(async () => new Promise((resolve, reject) => {
        ipcRenderer.once("main-ready", () => {
            ContainerBuilder.get()
                .module(new SimpleModule())
                .module(new ElectronModule())
                .build()
                .initialize()
                .then(container => {
                    ipcRendererBus = container.registry.resolve<Bus>(BusSymbol)
                    resolve()
                })
                .catch(reject)
        })
        ipcRenderer.on("main-log", (evt, message) => {
            console.info(message)
        })
    }))
    it("should publish and subscribe to events", function (done) {
        ipcRendererBus.subscribe(FromMainEvent, (message) => {
            assert.ok(message)
            done()
        })
        const event = new FromRendererEvent("Hello World!")
        ipcRendererBus.publish(event).catch(done)
    })
    describe("from Renderer to Main", function () {
        it("should execute command", async function () {
            const commandA = new CommandA("World")
            const resultA = await ipcRendererBus.execute<CommandA, ResultA>(commandA, ResultA)
            assert.ok(resultA)
            assert.equal(resultA.body, "Hello, World!")
        })
    })
    describe("from Main to Renderer", function () {
        it("should execute command", function (done) {
            ipcRendererBus.handle<CommandB, ResultB>(CommandB, ResultB, async (command) => {
                return ResultB.createFromCommand(command, `Hello, ${command.body}!`)
            })
            ipcRenderer.on("execute-CommandB-ok", () => done())
            ipcRenderer.on("execute-CommandB-ko", (_, error) => done(error))
            ipcRenderer.send("execute-CommandB")
        })
    })
})
