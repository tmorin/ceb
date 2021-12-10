import { Component } from "@tmorin/ceb-inversion-core"

// define a component
export class MyModule extends Component {
  async configure(): Promise<void> {
    // execute things when container starts
  }

  async dispose(): Promise<void> {
    // execute things when container stops
  }
}
