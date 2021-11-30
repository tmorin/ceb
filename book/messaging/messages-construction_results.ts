import { MessageBuilder } from "@tmorin/ceb-messaging-core"

// create a basic command
const commandA = MessageBuilder.command("CommandA").build()

// create a result
const resultA = MessageBuilder.result(commandA)
  // override the message type, by default it's `result`
  .type("custom-type")
  // set a custom identifier
  .identifier("result-1")
  // add an header entry
  .headers({ k1: "v1" })
  // set a body
  .body("a body")
  // build the result
  .build()
