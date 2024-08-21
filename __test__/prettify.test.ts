import { z } from "zod"
import { fromError, validate } from "../core"
import { vi } from "vitest"

const anySchema = z.object({
  name: z.string(),
  age: z.number().min(22).max(100),
  user: z.object({
    fullName: z.string()
  })
})

const data = {
  name: 1,
  age: 1,
  user: {
    fullName: 22
  }
}

test("Should prettify zod error", () => {
  const parser = validate(anySchema, data)
  vi.spyOn(parser, "prettify")

  const res = parser.prettify()


  expect(parser.prettify).toHaveBeenCalled()
  expect(parser.prettify).toHaveBeenCalledTimes(1)
  expect(res).toHaveLength(2)
})

test("Should pprettify zod error by error", async () => {


  try {
    anySchema.parse(data)
  } catch (error) {
    const validationError = fromError(error)

    const errorString = validationError.toString()

    expect(errorString).toBeTruthy()
  }

})