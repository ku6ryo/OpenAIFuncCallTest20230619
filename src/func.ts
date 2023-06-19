import { ChatCompletionFunctions } from "openai"

export const functions: ChatCompletionFunctions[] = [
  {
    "name": "getWeather",
    "description": "Call a wheather API and get wheather information",
    "parameters": {
      "type": "object",
      "properties": {
        "city": {
          "type": "string",
          "description": "Name of a city",
        },
      },
      "required": ["city"],
    },
  }
]

function getWeather(city: string) {
  const options = ["sunny", "cloudy", "rainy"]
  return options[Math.floor(Math.random() * options.length)]
}

export async function callFunc(name: string, args: any) {
  if (typeof args !== "object") {
    throw new Error("args are not object")
  }
  if (name === "getWeather") {
    const { city } = args
    if (typeof city !== "string") {
      throw new Error("city is not string")
    }
    return getWeather(city)
  } else {
    throw new Error("invalid function name")
  }
}