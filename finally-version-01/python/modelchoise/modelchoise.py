import os
from langchain.callbacks.streaming_stdout_final_only import (
    FinalStreamingStdOutCallbackHandler,
)
# 各种 系统环境变量的 各种设置
def os_setenv():
    # 初始化 AKs&SKs

    # spark
    os.environ["IFLYTEK_SPARK_APP_ID"] = "99927b03"
    os.environ["IFLYTEK_SPARK_API_KEY"] = "f922159ea3df9434d2e9e2bace2f0161"
    os.environ["IFLYTEK_SPARK_API_SECRET"] = "ZjNiNmI5ZjUzN2JjNDE5YzM4MTkyYWZm"
    """spark4.0U"""
    os.environ["IFLYTEK_SPARK_API_URL"] = "wss://spark-api.xf-yun.com/v4.0/chat"
    os.environ["IFLYTEK_SPARK_llm_DOMAIN"] = "4.0Ultra"
    """spark pro"""
    # os.environ["IFLYTEK_SPARK_API_URL"] = " wss://spark-api.xf-yun.com/v3.1/chat"
    # os.environ["IFLYTEK_SPARK_llm_DOMAIN"] = "generalv3"
    # zhipu
    os.environ["ZHIPUAI_API_KEY"] = "0bc13e3927392d5b85492d6d5fd52e07.lQntmufSZWeKGB3P"
    # openai
    os.environ["OPENAI_API_KEY"] = "sk-Jwh1snBECe3PSlCahPkVGsL8hRVsCrGd4YgNtTHmZdE1X24H"
    os.environ["OPENAI_API_BASE"] = "https://api.chatanywhere.tech/v1"
    # serpapi
    os.environ["SERPAPI_API_KEY"] = "290352400b4171fbe827aabdf422cf7a95a496976237c9bbc4908dbf77e76643"
    os.environ["USER_AGENT"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0"
    # googlesearch
    # 自定义搜索引擎：https://programmablesearchengine.google.com/controlpanel
    os.environ["GOOGLE_CSE_ID"] = "60943d88585de40d9"
    os.environ["GOOGLE_API_KEY"] = "AIzaSyC_BSH6P8h6s5Xh0ND_QNdGd18LdJGhIxM"
    # tongyiqianwen
    os.environ["DASHSCOPE_API_KEY"] = "sk-e8b1f9b79e0a43f68c00a1ca70b667ee"

    pass


def get_openai_chat_model():
    from langchain_openai import ChatOpenAI
    # langchain API https://python.langchain.com/v0.2/docs/integrations/chat/openai/
    chat_model_openai = ChatOpenAI(
        # openai API https://platform.openai.com/docs/models
        # model="gpt-4o",
        model="gpt-3.5-turbo",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        streaming=True,
        callbacks=[FinalStreamingStdOutCallbackHandler()],
    )
    return chat_model_openai

def get_spark_chat_model():
    from langchain_community.chat_models import ChatSparkLLM
    chat_model_spark = ChatSparkLLM(
        streaming=True,
        temperature=0,
        callbacks=[FinalStreamingStdOutCallbackHandler()],
    )
    return chat_model_spark

# 智谱清言已经欠费啦
def get_zhipuai_chat_model():
    from langchain_community.chat_models import ChatZhipuAI
    chat_model_zhipuai = ChatZhipuAI(
        model="glm-4",
        temperature=0,
        streaming=True,
        callbacks=[FinalStreamingStdOutCallbackHandler()],
    )
    return chat_model_zhipuai

def get_tongyiqwen_chat_model():
    from langchain_community.chat_models.tongyi import ChatTongyi
    chat_model_tongyiqianwen = ChatTongyi(
        model="qwen-max",
        streaming=True,
        temperature=0,
        callbacks=[FinalStreamingStdOutCallbackHandler()],
    )
    return chat_model_tongyiqianwen

