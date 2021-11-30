import {ipcMain, webContents} from 'electron'
import {assert} from "chai"
import {SimpleGatewaySymbol, SimpleModule} from "@tmorin/ceb-messaging-simple"
import {ElectronModule} from "../inversion"
import {ContainerBuilder} from "@tmorin/ceb-inversion-core"
import {IpcMainGateway} from "../ipc-main"
import {Command, Event, GatewaySymbol, MessageBuilder, Result} from "@tmorin/ceb-messaging-core"

function log(text: string) {
    webContents.getAllWebContents().forEach(webContent => webContent
        .send("main-log", `${text}`))
}

ContainerBuilder.get()
    .module(new SimpleModule({gatewayRegistryKey: SimpleGatewaySymbol}))
    .module(new ElectronModule())
    .build()
    .initialize()
    .then(_container => {
        const ipcBus = _container.registry.resolve<IpcMainGateway>(GatewaySymbol)

        ipcMain.on("execute-CommandB", async (event) => {
            try {
                const commandB = MessageBuilder.command("CommandB").body("World").build()
                const resultB = await ipcBus.commands.execute(commandB)
                assert.ok(resultB)
                assert.equal(resultB.body, "Hello, World!")
                event.reply("execute-CommandB-ok")
            } catch (error) {
                event.reply("execute-CommandB-ko", error)
            }
        })

        ipcBus.events.subscribe<Event<string>>("FromRendererEvent", (message) => {
            const event = MessageBuilder.event("FromMainEvent").body(`main[ ${message.body} ]`).build()
            return ipcBus.events.publish(event)
        })

        ipcBus.commands.handle<Command<string>, Result<string>>("CommandA", async (command) => {
            const result = MessageBuilder.result(command).body(`Hello, ${command.body}!`).build()
            return {result}
        })
    })
    .catch(error => log(`container failed to start: ${error.name} ${error.message}`))
