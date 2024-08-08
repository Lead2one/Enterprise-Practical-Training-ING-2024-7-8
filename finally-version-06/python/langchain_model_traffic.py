from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain.prompts import PromptTemplate
from modelchoise import modelchoise
from langchain.prompts import ChatPromptTemplate
import asyncio


class NavigationRequestParser:
    def __init__(self):
        # 设置环境变量
        modelchoise.os_setenv()

        # 获取模型
        self.model = modelchoise.get_tongyiqwen_chat_model()

        # 定义输出格式和响应模式
        self.out_response_schemas = [
            ResponseSchema(name="出发地", description="输出用户的出发地，必须为确切的地址，不能有其他的内容"),
            ResponseSchema(name="目的地", description="输出用户的目的地，必须为确切的地址，不能有其他的内容"),
            ResponseSchema(name="交通工具",
                           description="输出用户要求的交通工具，要求只能从以下三个词中选择：汽车，骑行，步行")
        ]

        self.output_parser = StructuredOutputParser.from_response_schemas(self.out_response_schemas)
        self.format_instructions = self.output_parser.get_format_instructions()

        # 定义提示模板
        self.out_prompt_str = ("你的任务是将用户发的导航请求内容{input}进行分析，提取出用户的出发地，目的地，想采用的交通工具，并返回结果"
                               "要求：出发地必须为确切的地址，不能有其他的内容"
                               "目的地必须为确切的地址，不能有其他的内容"
                               "交通工具必须为确切的交通工具，只能从以下三个词中选择：汽车，骑行，步行"
                               "严格遵守输出格式{format_instructions}")

        self.prompt = PromptTemplate.from_template(
            template=self.out_prompt_str,
            partial_variables={"format_instructions": self.format_instructions}
        )

    async def parse_navigation_request(self, user_input):
        # 格式化提示
        formatted_prompt = self.prompt.format_prompt(input=user_input)

        # 调用模型并获取响应
        async for chunk in self.model.astream(formatted_prompt):
            yield chunk.content

# 使用示例
if __name__ == "__main__":
    async def main():
        parser = NavigationRequestParser()
        user_input = "我从济南西站下车，该如何步行到达大明湖景区呢？"
        await parser.parse_navigation_request(user_input)
    asyncio.run(main())
