import {ipcMain, webContents} from 'electron'
import {assert} from "chai";
import {IpcMainBus} from "../bus-main";
import {InMemorySimpleBus} from "@tmorin/ceb-messaging-simple";
import {CommandA, CommandB, Converter, FromMainEvent, FromRendererEvent, ResultA, ResultB} from "./fixture";

const parent = new InMemorySimpleBus()
const ipcBus = new IpcMainBus(parent, new Converter(), ipcMain)

function log(text: string) {
    webContents.getAllWebContents().forEach(webContent => webContent
        .send("main-log", `${text}`))
}

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

ipcBus.subscribe<FromRendererEvent>(FromRendererEvent.NAME, (message) => {
    return ipcBus.publish(new FromMainEvent(`main[ ${message.body} ]`))
})

ipcBus.handle<CommandA, ResultA>(CommandA.NAME, ResultA, async (command: CommandA): Promise<ResultA> => {
    return ResultA.createFromCommand(command, `Hello, ${command.body}!`)
})
