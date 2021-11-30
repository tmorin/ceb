import { MessageBuilder } from "@tmorin/ceb-messaging-core"

// create a command
const aCommandA = MessageBuilder.command("CommandA")
  // set a custom identifier
  .identifier("command-1")
  // add an header entry
  .headers({ k1: "v1" })
  // set a body
  .body("a body")
  // build the result
  .build()
