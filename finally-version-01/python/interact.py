from quart import Quart, request, jsonify, send_from_directory,Response
from quart_cors import cors
from langchain_dishmap_new import ChatAssistant
from langchain_core.messages.human import HumanMessage
from langchain_community.chat_message_histories import RedisChatMessageHistory
from base_model import ChatAssistantAgent
import json
import os
import ASR_Recognize
import TTS
import ASR_Listener

app = Quart(__name__)
app = cors(app, allow_origin="*")
chat_model_cooking = ChatAssistant(category="cooking")
chat_model_nutrition = ChatAssistant(category="nutrition")
chat_model_out = ChatAssistant(category="out")
basemodel = ChatAssistantAgent()

session_id = "food"
redis_url = "redis://localhost:6379"

# 获取当前文件夹的路径
current_dir = os.path.dirname(os.path.abspath(__file__))
# 获取上一级目录的路径
parent_dir = os.path.abspath(os.path.join(current_dir, os.pardir))
# 指定HTML文件所在的文件夹路径
html_dir = os.path.join(parent_dir, 'statics')

# @app.route('/')
# def index():
#     return send_from_directory(html_dir, 'food.html')

# modelchat
@app.route('/stream', methods=['GET'])
async def stream():
    global user_input
    user_input = request.args.get('input')
    model_choice = request.args.get('model_choice')
    print(f"Generating response for user input: {user_input,model_choice}")
    if model_choice == '0':
        chat_model_dish = chat_model_cooking
    elif model_choice == '1':
        chat_model_dish = chat_model_nutrition
    elif model_choice == '2':
        chat_model_dish = chat_model_out
    else:
        return Response(status=204)
      # Debug print

    if user_input is None:
        return Response(status=204)

    async def generate():
        async for res in chat_model_dish.chat(user_input):
            print(f"Yielding response chunk: {res}")  # Debug print
            yield f"data: {json.dumps({'processed': res})}\n\n"
        yield f"data: {json.dumps({'processed': '[DONE]'})}\n\n"  # End of stream

    return Response(generate(), content_type='text/event-stream')


@app.route('/history', methods=['GET'])
async def get_dialogues():
    chat_history = RedisChatMessageHistory(session_id=session_id, url=redis_url)
    history = chat_history.messages  # 获取对话记录

    # 将对话记录转换为字典列表，方便前端处理
    history_list = [
        {
            "type": "human" if isinstance(msg, HumanMessage) else "ai",
            "content": msg.content
        }
        for msg in history
    ]
    return jsonify(history_list)


# basemodelchat
@app.route('/stream1', methods=['GET'])
async def stream1():
    global user_input
    user_input = request.args.get('input')
    print(f"Generating response for user input: {user_input}")

    if user_input is None:
        return Response(status=204)

    async def generate():
        async for res in basemodel.chat(user_input):
            print(f"Yielding response chunk: {res}")  # Debug print
            yield f"data: {json.dumps({'processed': res})}\n\n"
        yield f"data: {json.dumps({'processed': '[DONE]'})}\n\n"  # End of stream
    

    return Response(generate(), content_type='text/event-stream')

if __name__ == '__main__':
    app.run(debug=True,port=5001)



