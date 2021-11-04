import {assert} from "chai"
import {ipcRenderer} from 'electron'
import {InMemorySimpleBus} from "@tmorin/ceb-messaging-simple";
import {Bus} from "@tmorin/ceb-messaging-core";
import {IpcRendererBus} from "./bus-renderer";
import {CommandA, CommandB, Converter, FromMainEvent, FromRendererEvent, ResultA, ResultB} from "./__TEST/fixture";

describe("IPC", function () {
    this.timeout(5000)
    let parentBus: InMemorySimpleBus
    let ipcRendererBus: Bus
    before(async () => new Promise((resolve) => {
        ipcRenderer.once("main-ready", () => {
            parentBus = new InMemorySimpleBus()
            ipcRendererBus = new IpcRendererBus(parentBus, new Converter(), ipcRenderer)
            resolve()
        })
        ipcRenderer.on("main-log", (evt, message) => {
            console.info(message)
        })
    }))
    it("should publish and subscribe to events", function (done) {
        ipcRendererBus.subscribe(FromMainEvent.NAME, (message) => {
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
            ipcRendererBus.handle<CommandB, ResultB>(CommandB.NAME, ResultB, async (command) => {
                return ResultB.createFromCommand(command, `Hello, ${command.body}!`)
            })
            ipcRenderer.on("execute-CommandB-ok", () => done())
            ipcRenderer.on("execute-CommandB-ko", (_, error) => done(error))
            ipcRenderer.send("execute-CommandB")
        })
    })
})
