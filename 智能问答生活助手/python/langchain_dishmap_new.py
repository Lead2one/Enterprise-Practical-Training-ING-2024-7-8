from modelchoise import modelchoise
import asyncio
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.retrievers.multi_query import MultiQueryRetriever
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import RedisChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain.prompts import PromptTemplate

EMBEDDING_DEVICE = "cpu"

# vscode中路径说明
# FAISS_INDEX_PATH_DISH = "faiss_index_summary/faiss_index_dish"
# FAISS_INDEX_PATH_MEDICINE = "faiss_index_summary/faiss_index_medicine"
# FAISS_INDEX_PATH_TRAVEL = "faiss_index_summary/faiss_index_travel"

# pycharm中的路径说明
FAISS_INDEX_PATH_DISH = "../faiss_index_summary/faiss_index_dish"
FAISS_INDEX_PATH_MEDICINE = "../faiss_index_summary/faiss_index_medicine"
FAISS_INDEX_PATH_TRAVEL = "../faiss_index_summary/faiss_index_travel"

redis_url = "redis://localhost:6379"
m3e_path = "../models/m3e-base-huggingface"

cooking_prompt_str = "你是一位世界闻名的厨师，可以根据用户的所输入的预算，所想要吃的菜品，结合所检索出来的内容给出相应的菜品制作方案，\
要求输出格式必须是Markdown形式，将菜品名称，所用原材料，菜品制作过程，分别列出，每个自称一段，原材料最好以表格的形式输出。{context}"
nutrition_prompt_str = "你是一个食物学家，可以根据用户所输入的物品，根据检索食物成分表所给出的内容来给出相应的物品的营养成分表，\
要求输出格式必须是Markdown表格形式。输出格式如下：\n\n| 食物名称 | 营养元素 | 含量 |\n| --- | --- | --- |\n{context}"
out_prompt_str = "你是一名滨海新区的生活助手，可以根据用户的用餐要求{input}，根据所检索出来的数据{context}，提供给用户多个合理，正确的用餐地点，\
要求该地点必须在滨海新区内。严格遵守输出格式：{format_instructions}。"
medicine_prompt_str = """
            "你是一位世界闻名的医生，你能根据用户所输入的内容，给予合理的帮助"
            "必须按照如下情况来分情况判断"
            "一、如果用户的输入为咨询医疗，健康相关问题，直接结合所查询的内容回答即可"
            "二、如果用户的输入为查询某种中药的疗效，必须将中药名称，中药配方，出处，功效，使用方法，注意事项均以列表的形式给出，按照检索得到的内容进行回答，要求内容必须详细，清楚"
            "三、如果用户的输入为其得病的情况，则先分析用户的当前病情，并根据所检索到的内容，针对用户当前的状态，给出相对应的用药参考。要求将药品名称，出处，功效，使用剂量，注意事项给出，要求内容详细，清楚"
            "要求结果必须是markdown格式{context}"),
"""
travel_prompt_str = "你是一位旅行家，你能根据用户提供的旅行要求，结合所检索到的内容，其中包括旅行指南以及景区信息，提供相关的旅行帮助，要求内容详细，清楚，必须明确指出用户的详细旅游方案，要求结果必须是markdown格式{context}"

out_response_schemas = [
    ResponseSchema(name="餐馆名称", description="输出餐馆的名称"),
    ResponseSchema(name="经度", description="输出餐馆的经度"),
    ResponseSchema(name="纬度", description="输出餐馆的纬度")
]
output_parser = StructuredOutputParser.from_response_schemas(out_response_schemas)
format_instructions = output_parser.get_format_instructions()

embeddings = HuggingFaceEmbeddings(
            model_name=m3e_path,
            model_kwargs={'device': EMBEDDING_DEVICE}
)
# vector = FAISS.load_local(
#             FAISS_INDEX_PATH,
#             embeddings=embeddings,
#             allow_dangerous_deserialization=True
# )
class ChatAssistant:
    def __init__(self, category):
        modelchoise.os_setenv()
        # $redis-server.exe redis.windows.conf
        self.category = category
        self.session_id = str(category)
        self.history = RedisChatMessageHistory(session_id=self.session_id, url=redis_url)
        self.config = {"configurable": {"session_id": self.session_id}}
        # 模型实例化
        self.chat_model = modelchoise.get_tongyiqwen_chat_model()

        # 构建向量存储
        self.embeddings = embeddings

        self.faiss_index_path = ""

        if self.category == "cooking":
            self.faiss_index_path = FAISS_INDEX_PATH_DISH
        elif self.category == "out":
            self.faiss_index_path = FAISS_INDEX_PATH_DISH
        elif self.category == "medicine":
            self.faiss_index_path = FAISS_INDEX_PATH_MEDICINE
        elif self.category == "travel":
            self.faiss_index_path = FAISS_INDEX_PATH_TRAVEL
        elif self.category == "nutrition":
            self.faiss_index_path = FAISS_INDEX_PATH_DISH

        self.vector = FAISS.load_local(
            self.faiss_index_path,
            embeddings=embeddings,
            allow_dangerous_deserialization=True
        )

        self.retriever = self.vector.as_retriever()

        # 初始化MultiQueryRetriever
        self.retriever_from_llm = MultiQueryRetriever.from_llm(
            retriever=self.retriever,
            llm=self.chat_model
        )

        # 初始化Prompt模板和文档链
        self.chat_prompt_template = self.create_chat_prompt_template(category)
        self.document_chain = create_stuff_documents_chain(
            self.chat_model,
            self.chat_prompt_template
        )

        # 初始化检索链
        self.retrieval_chain = create_retrieval_chain(
            self.retriever_from_llm,
            self.document_chain
        )

        # 历史链
        self.chain_with_history = RunnableWithMessageHistory(
            self.retrieval_chain,
            lambda session_id: RedisChatMessageHistory(
                self.session_id, url=redis_url
            ),
            input_messages_key="input",
            history_messages_key="history",
        )

    def create_chat_prompt_template(self,  category):
        if category == "cooking":
            prompt = ChatPromptTemplate.from_messages([
                ("system", cooking_prompt_str),
                MessagesPlaceholder(variable_name="history"),
                ("human", "{input}")
            ])
        elif category == "nutrition":
            prompt = ChatPromptTemplate.from_messages([
                ("system", nutrition_prompt_str),
                MessagesPlaceholder(variable_name="history"),
                ("human", "{input}"),
            ])

        elif category == "out":
            prompt = PromptTemplate.from_template(
                template=out_prompt_str,
                partial_variables={"format_instructions": format_instructions}
            )
        elif category == "medicine":
            prompt = ChatPromptTemplate.from_messages([
                ("system", medicine_prompt_str),
                MessagesPlaceholder(variable_name="history"),
                ("human", "{input}"),
            ])
        elif category == "travel":
            prompt = ChatPromptTemplate.from_messages([
                ("system",travel_prompt_str),
                MessagesPlaceholder(variable_name="history"),
                ("human", "{input}"),
            ])
        else:
            print("error!")
            return

        return prompt

    async def chat(self, input_text, user_id, chat_id):
        answer = ""
        full_session_id = ""
        if self.session_id != "nutrition":
            full_session_id = str(user_id) + self.session_id + str(chat_id)
        else:
            full_session_id = str(user_id) + "cooking" + str(chat_id)

        history = RedisChatMessageHistory(session_id=full_session_id, url=redis_url)
        async for chunk in self.chain_with_history.astream({"input": input_text}, config=self.config):
            if 'answer' in chunk:
                answer += chunk["answer"]
                yield chunk["answer"]
        if self.category != "out":
            self.history.add_user_message(input_text)
            self.history.add_ai_message(answer)
            history.add_user_message(input_text)
            history.add_ai_message(answer)

    # def get_history(self):
    #     return self.history.messages

if __name__ == "__main__":
    async def main():
        chat_model = ChatAssistant(category="out")
        await chat_model.chat("我想吃酸菜鱼")
    asyncio.run(main())
    chat_model = ChatAssistant(category="cooking")
    # print(chat_model.get_history())