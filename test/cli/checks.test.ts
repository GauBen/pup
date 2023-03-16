import { assertEquals, assertThrows, spy } from "../deps.ts"
import { checkArguments } from "../../lib/cli/checks.ts"
import { Application } from "../../application.meta.ts"
import { printHeader, printUsage } from "../../lib/cli/output.ts"

Deno.test("checkArguments should throw error when autostart argument is provided without init, append or no-config", async () => {
  const args = { _: [], autostart: true }
  await assertThrows(
    () => {
      checkArguments(args)
    },
    Error,
    "Argument '--autostart' requires '--init', '--append' or '--no-config'",
  )
})

Deno.test("checkArguments should throw error when cron argument is provided without init or append", async () => {
  const args = { _: [], cron: true }
  await assertThrows(
    () => {
      checkArguments(args)
    },
    Error,
    "Argument '--cron' requires '--init', '--append' or '--no-config'",
  )
})

Deno.test("checkArguments should throw error when watch argument is provided without init or append", async () => {
  const args = { _: [], watch: "path" }
  await assertThrows(
    () => {
      checkArguments(args)
    },
    Error,
    "Argument '--watch' requires '--init', '--append' or '--no-config'",
  )
})

Deno.test("checkArguments should throw error when cmd argument is provided without init, append or no-config", async () => {
  const args = { _: [], cmd: "command" }
  await assertThrows(
    () => {
      checkArguments(args)
    },
    Error,
    "Argument '--cmd' requires '--init', '--append' or '--no-config'",
  )
})

Deno.test("checkArguments should throw error when init or append argument is provided without cmd", async () => {
  const args = { _: [], init: true }
  await assertThrows(
    () => {
      checkArguments(args)
    },
    Error,
    "Arguments '--init', '--append', and '--no-config' require '--cmd'",
  )
})

Deno.test("checkArguments should throw error when id argument is missing with init or append argument", async () => {
  const args = { _: [], init: true, cmd: "command" }
  await assertThrows(
    () => {
      checkArguments(args)
    },
    Error,
    "Arguments '--init','--append', and '--remove' require '--id'",
  )
})

Deno.test("printHeader should output the name, version, and repository of the application", () => {
  const expectedName = "pup"
  const expectedRepository = "https://github.com/hexagon/pup"
  const consoleSpy = spy(console, "log")
  printHeader()
  assertEquals(
    consoleSpy.calls[0].args[0],
    `${expectedName} ${Application.version}`,
  )
  assertEquals(
    consoleSpy.calls[1].args[0],
    expectedRepository,
  )
  consoleSpy.restore()
})

Deno.test("printUsage should output the usage of the application", () => {
  const consoleSpy = spy(console, "log")
  printUsage()
  const expectedOutput = `Usage: ${Application.name} [OPTIONS...]`
  assertEquals(consoleSpy.calls[0].args[0], expectedOutput)
  consoleSpy.restore()
})

Deno.test("checkArguments should return the provided arguments when they are valid", () => {
  const expectedArgs = {
    _: [],
    init: true,
    cmd: "command",
    id: "taskId",
  }
  const result = checkArguments(expectedArgs)
  assertEquals(result, expectedArgs)
})
