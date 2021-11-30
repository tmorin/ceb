export class ServiceA {
  methodA() {
    return "resultA"
  }
}

export class ServiceB {
  private readonly serviceA: ServiceA

  constructor(serviceA: ServiceA) {
    this.serviceA = serviceA
  }

  methodA() {
    return this.serviceA.methodA()
  }
}
