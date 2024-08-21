import { z, ZodError } from "zod";

export function validate<S extends z.ZodTypeAny, TData>(schema: S, data: TData) {
  const response = schema.safeParse(data)

  function prettify() {
    if (response.success) return [response.data as z.infer<S>, response.error] as const

    const errorString = createErrorString(response.error)

    return [response.data, errorString] as const
  }

  return {
    prettify
  }
}

export function fromError(error: unknown) {

  function toString() {
    return createErrorString(error)
  }

  return {
    toString,
    error
  }
}

function createErrorString(error: unknown) {
  let errorMessage = ""

  if (!(error instanceof ZodError)) return (error as Error).message

  for (let index = 0; index < error.errors.length; index++) {
    const errorItem = error.errors[index];

    const formatErrorCode = errorItem.code.split("_").reduce((acc, curr) => {
      const firstChar = curr.charAt(0)
      const part = curr.slice(1)

      acc += firstChar + part + " "

      return acc
    }, "")

    if (!("expected" in errorItem)) {
      errorMessage += `Error # ${index + 1}: ${errorItem.message} at: ${extractPath(errorItem.path)}; `
      continue
    }

    errorMessage += `Error # ${index + 1}: ${formatErrorCode.trimEnd()}, expect: ${errorItem.expected}, receive: ${errorItem.received} at: ${extractPath(errorItem.path)}; `
  }

  return errorMessage.trim()
}

function extractPath(path: (string | number)[]) {
  return path.join(" -> ")
}