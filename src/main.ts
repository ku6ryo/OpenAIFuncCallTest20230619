import "dotenv/config"
import { Configuration, OpenAIApi } from "openai"
import readline from "readline"

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }))

const functions = [
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

const callFunc = (name: string, args: any) => {
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

type Message = {
  role: "user" | "assistant" | "system" | "function",
  name?: string,
  content: string
}

;(async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  let messages = [] as Message[]
  while (true) {
    const text = await new Promise<string>((resolve) => {
      rl.question("input: ", function(input) {
        resolve(input)
      })
    })
    const userMsg = { role: "user", content: text } as Message
    messages.push(userMsg)
    const result = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages,
      functions,
    })
    const { finish_reason, message } = result.data.choices[0]
    if (!message) {
      throw new Error("no message")
    }
    if (finish_reason === "function_call") {
      const { function_call } = message
      if (!function_call) {
        throw new Error("no function_call")
      }
      console.log(function_call)
      const { name, arguments: args } = function_call
      if (!name || !args) {
        throw new Error("invalid function_call")
      }
      const res = callFunc(name, JSON.parse(args))
      messages.push({ role: "function", name, content: res } as Message)
      const result = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-0613",
        messages,
        functions,
      })
      const { message: msg } = result.data.choices[0]
      messages.push({ role: "assistant", content: msg?.content || "" } as Message)
      console.log(result.data.choices)
    } else if (finish_reason === "stop") {
      messages.push({ role: "assistant", content: message?.content || "" } as Message)
      console.log(result.data.choices)
    }
  }
})()