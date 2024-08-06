from modelchoise import modelchoise
from langchain.prompts import ChatPromptTemplate
import asyncio
modelchoise.os_setenv()  # 初始化环境变量
model = modelchoise.get_tongyiqwen_chat_model()
prompt_template = ChatPromptTemplate.from_messages(
    [
        ("system", "用户输入的内容是一个包含导航信息的路径信息，包含出发地以及目的地，请你分析路径信息中的内容，提取其中的导航信息，并将提取得到的信息汇总，要求要将用户的出发地，目的地，规划路线分别列出，以详细，流利的语言叙述出来，要求输出格式必须为markdown格式"),
        ("human", "{input}")
    ]
)

class NavigationInfoExtractor:
    def __init__(self):
        self.model = model  # 获取模型
        self.prompt_template = prompt_template

    async def extract_navigation_info(self, input_json):
        # 使用提示模板生成提示
        prompt = self.prompt_template.format_prompt(input=input_json)
        # 调用模型生成响应
        async for chunk in self.model.astream(prompt):
            yield chunk.content


# 使用示例
if __name__ == "__main__":
    async def main():
        extractor = NavigationInfoExtractor()
        await extractor.extract_navigation_info("""向西北步行160米右转
            向北步行91米右转
            沿威海路向东步行731米左转
            沿齐州路向北步行454米右转
            沿兴福寺路步行3727米直行
            沿幸福街步行1685米右转
            沿济齐路向东南步行334米向左前方行走
            向东南步行316米直行
            向东南步行40米左转
            沿堤口路辅路向东步行2439米右转
            沿西工商河路向东步行425米直行
            沿东西丹凤街向东步行526米直行
            沿义合北街向东步行635米直行
            沿新菜市向东南步行145米直行
            沿济安街向东南步行280米左转
            沿少年路向东步行555米直行
            沿趵突泉北路向东南步行88米左转
            沿大明湖路步行388米左转
            向北步行133米右转
            向东步行195米到达目的地
            出发地：济南西站 目的地：大明湖景区""")
    asyncio.run(main())
