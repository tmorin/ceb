import {ipcMain, webContents} from 'electron'
import {assert} from "chai";
import {InMemorySimpleBusSymbol, SimpleModule} from "@tmorin/ceb-messaging-simple";
import {CommandA, CommandB, FromMainEvent, FromRendererEvent, ResultA, ResultB} from "./fixture";
import {ElectronModule} from "../inversion";
import {ContainerBuilder} from "@tmorin/ceb-inversion";
import {Bus, BusSymbol} from "@tmorin/ceb-messaging-core";

function log(text: string) {
    webContents.getAllWebContents().forEach(webContent => webContent
        .send("main-log", `${text}`))
}

ContainerBuilder.get()
    .module(new SimpleModule({registryKey: InMemorySimpleBusSymbol}))
    .module(new ElectronModule(InMemorySimpleBusSymbol))
    .build()
    .initialize()
    .then(_container => {
        const ipcBus = _container.registry.resolve<Bus>(BusSymbol)

        ipcMain.on("execute-CommandB", async (event) => {
            try {
                const resultB = await ipcBus.execute(new CommandB("World"), ResultB)
                assert.ok(resultB)
                assert.equal(resultB.body, "Hello, World!")
                event.reply("execute-CommandB-ok")
            } catch (error) {
                event.reply("execute-CommandB-ko", error)
            }
        })

        ipcBus.subscribe<FromRendererEvent>(FromRendererEvent, (message) => {
            return ipcBus.publish(new FromMainEvent(`main[ ${message.body} ]`))
        })

        ipcBus.handle<CommandA, ResultA>(CommandA, ResultA, async (command: CommandA): Promise<ResultA> => {
            return ResultA.createFromCommand(command, `Hello, ${command.body}!`)
        })
    })
    .catch(error => log(`container failed to start: ${error.name} ${error.message}`))
