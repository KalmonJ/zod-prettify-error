import { z } from "zod"
import { validate } from "../core/prettify"
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

  console.log(res, "res")

  expect(parser.toString).toHaveBeenCalled()
  expect(parser.toString).toHaveBeenCalledTimes(1)
  expect(res).toHaveLength(2)
})