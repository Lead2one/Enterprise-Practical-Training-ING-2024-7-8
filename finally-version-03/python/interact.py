from quart import Quart, request, jsonify, send_from_directory, Response
from quart_cors import cors
from langchain_dishmap_new import ChatAssistant
from langchain_core.messages.human import HumanMessage
from langchain_community.chat_message_histories import RedisChatMessageHistory
from base_model import ChatAssistantAgent
import json
import os

app = Quart(__name__)
app = cors(app, allow_origin="*")
chat_model_cooking = ChatAssistant(category="cooking")
chat_model_nutrition = ChatAssistant(category="nutrition")
chat_model_out = ChatAssistant(category="out")
basemodel = ChatAssistantAgent()

user_input = None

user_id = None

chat_id = None

base_id = "base"
session_id = "food"
redis_url = "redis://localhost:6379"

# 获取当前文件夹的路径
current_dir = os.path.dirname(os.path.abspath(__file__))
# 获取上一级目录的路径
parent_dir = os.path.abspath(os.path.join(current_dir, os.pardir))
# 指定HTML文件所在的文件夹路径
html_dir = os.path.join(parent_dir, 'statics')


# 获取用户id
@app.route('/set_user_id', methods=['POST'])
async def set_user_id():
    global user_id
    data = await request.get_json()
    print(data)
    user_id = data.get('user_id')
    print(user_id)
    return jsonify({'success': True})


# 获取聊天id
@app.route('/set_chat_id', methods=['POST'])
async def set_chat_id():
    global chat_id
    data = await request.get_json()
    print(data)
    chat_id = data.get('index')
    print(chat_id)
    return jsonify({'success': True})


@app.route('/update_chat_id', methods=['POST'])
async def update_index():
    data = await request.json
    global chat_id
    chat_id = data.get('chat_id')
    # 在这里处理更新 currentIndex 的逻辑
    print(f"当前索引更新为: {chat_id}")
    return jsonify({'success': True})


# 发送userid到前端
@app.route('/getUsername', methods=['GET'])
def get_username():
    # 假设用户名保存在 session 中
    global user_id
    print(user_id)
    return jsonify({'success': True, 'username': user_id})


# modelchat
@app.route('/stream', methods=['GET'])
async def stream():
    global user_input
    user_input = request.args.get('input')
    model_choice = request.args.get('model_choice')
    print(f"Generating response for user input: {user_input, model_choice}")
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

    global user_id
    global chat_id

    if user_id is None:
        return Response(status=204)
    if chat_id is None:
        return Response(status=204)

    async def generate():
        async for res in chat_model_dish.chat(user_input, user_id, chat_id):
            print(f"Yielding response chunk: {res}")  # Debug print
            yield f"data: {json.dumps({'processed': res})}\n\n"
        yield f"data: {json.dumps({'processed': '[DONE]'})}\n\n"  # End of stream

    return Response(generate(), content_type='text/event-stream')


@app.route('/history', methods=['GET'])
async def get_dialogues():
    global user_id
    global chat_id

    if user_id is None:
        return Response(status=204)
    if chat_id is None:
        return Response(status=204)

    full_id = str(user_id) + session_id + str(chat_id)

    chat_history = RedisChatMessageHistory(session_id=full_id, url=redis_url)
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

@app.route('/base_history', methods=['GET'])
async def get_base_history():
    global user_id

    if user_id is None:
        return Response(status=204)

    full_id = str(user_id) + base_id

    chat_history = RedisChatMessageHistory(session_id=full_id, url=redis_url)
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


# base_model_chat
@app.route('/base_stream', methods=['GET'])
async def base_stream():
    global user_input
    user_input = request.args.get('input')
    print(f"Generating response for user input: {user_input}")

    if user_input is None:
        return Response(status=204)

    global user_id
    if user_id is None:
        return Response(status=204)


    async def generate():
        async for res in basemodel.chat(user_id=user_id, input_text=user_input):
            print(f"Yielding response chunk: {res}")  # Debug print
            yield f"data: {json.dumps({'processed': res})}\n\n"
        yield f"data: {json.dumps({'processed': '[DONE]'})}\n\n"  # End of stream

    return Response(generate(), content_type='text/event-stream')


if __name__ == '__main__':
    app.run(debug=True, port=5001)







