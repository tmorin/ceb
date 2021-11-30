import { MessageBuilder } from "@tmorin/ceb-messaging-core"

// create a query
const aQueryA = MessageBuilder.query("QueryA")
  // set a custom identifier
  .identifier("query-1")
  // add an header entry
  .headers({ k1: "v1" })
  // set a body
  .body("a body")
  // build the result
  .build()
