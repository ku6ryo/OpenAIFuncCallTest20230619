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
  },
  {
    "name": "getPopulation",
    "description": "Get population of a city",
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

function calcCodeSum(text: string) {
  let n = 0
  for (let i = 0; i < text.length; i++) {
    n += text.charCodeAt(i)
  }
  return n
}

/**
 * Get random population 
 */
function getPopulation(city: string) {
  return calcCodeSum(city) * 100
}

/**
 * Get random weather 
 */
function getWeather(city: string) {
  const n = calcCodeSum(city)
  const options = ["sunny", "cloudy", "rainy"]
  return options[n % options.length]
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
  } else if (name === "getPopulation") {
    const { city } = args
    if (typeof city !== "string") {
      throw new Error("city is not string")
    }
    return getPopulation(city).toString()
  } else {
    throw new Error("invalid function name")
  }
}