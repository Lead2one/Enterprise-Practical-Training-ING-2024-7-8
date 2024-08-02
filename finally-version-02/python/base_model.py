from modelchoise import modelchoise
from langchain.tools import BaseTool
from langchain.agents import initialize_agent, AgentType
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain_community.chat_message_histories import RedisChatMessageHistory
from langchain_community.agent_toolkits.load_tools import load_tools
import asyncio
modelchoise.os_setenv()

session_id = "test"
redis_url = "redis://localhost:6379"

tools_calculation = load_tools(
    tool_names=["serpapi", "llm-math"],
    llm=modelchoise.get_spark_chat_model()
)
tools_search = load_tools(
    tool_names=["google-search"],
    llm=modelchoise.get_tongyiqwen_chat_model()
)
class ChatAssistantAgent:

    def __init__(self):
        self.model = modelchoise.get_tongyiqwen_chat_model()

        self.tools = tools_search+tools_calculation

        # $redis-server.exe redis.windows.conf
        self.history = RedisChatMessageHistory(session_id=session_id, url=redis_url)
        # initialize conversational memory
        self.conversational_memory = ConversationBufferWindowMemory(
            memory_key='chat_history',
            k=10,
            return_messages=True
        )
        self.agent = initialize_agent(
            llm=self.model,
            tools=self.tools,
            agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION,
            verbose=True,
            handle_parsing_errors=True,
            memory=self.conversational_memory
        )

    async def chat(self, input_text):
        answer = ""
        async for chunk in self.agent.astream(input_text):
            if 'output' in chunk:
                answer += chunk['output']
                print(chunk['output'],end="")
                yield chunk["output"]
        self.history.add_user_message(input_text)
        self.history.add_ai_message(answer)


if __name__ == "__main__":

    agent = ChatAssistantAgent()


    async def main():
        async for output in agent.chat("介绍一下埃菲尔铁塔"):
            print(output)
        async for output in agent.chat("请计算1+1"):
            print(output)
        print(agent.history.messages)


    asyncio.run(main())