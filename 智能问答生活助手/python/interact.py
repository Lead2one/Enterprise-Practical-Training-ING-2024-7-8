from quart import Quart, request, jsonify, send_from_directory, Response
from quart_cors import cors
from langchain_dishmap_new import ChatAssistant
from langchain_core.messages.human import HumanMessage
from langchain_community.chat_message_histories import RedisChatMessageHistory
from base_model import ChatAssistantAgent
from langchain_model_traffic import NavigationRequestParser
from langchain_model_route_processing import NavigationInfoExtractor
import Text_to_Photo
import json
import os

app = Quart(__name__)
app = cors(app, allow_origin="*")
chat_model_cooking = ChatAssistant(category="cooking")
chat_model_out = ChatAssistant(category="out")
chat_model_medicine = ChatAssistant(category="medicine")
chat_model_travel = ChatAssistant(category="travel")
chat_model_nutrition = ChatAssistant(category="nutrition")
parser = NavigationRequestParser()
extractor = NavigationInfoExtractor()

basemodel = ChatAssistantAgent()

user_input = None

user_id = None

chat_id = None

model_choice = None

base_id = "base"

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

@app.route('/set_model_choice', methods=['POST'])
async def set_model_choice():
    global model_choice
    data = await request.get_json()
    print(data)
    model_choice = data.get('model_choice')
    print(model_choice)
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
        chat_model = chat_model_cooking
    elif model_choice == '2':
        chat_model = chat_model_out
    elif model_choice == '3':
        chat_model = chat_model_medicine
    elif model_choice == '4':
        chat_model = chat_model_travel
    elif model_choice == '5':
        chat_model = chat_model_nutrition
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
        async for res in chat_model.chat(user_input, user_id, chat_id):
            print(f"Yielding response chunk: {res}")  # Debug print
            yield f"data: {json.dumps({'processed': res})}\n\n"
        yield f"data: {json.dumps({'processed': '[DONE]'})}\n\n"  # End of stream

    return Response(generate(), content_type='text/event-stream')


@app.route('/history', methods=['GET'])
async def get_dialogues():
    global user_id
    global chat_id
    global model_choice
    if user_id is None:
        return Response(status=204)
    if chat_id is None:
        return Response(status=204)
    if model_choice is None:
        print(model_choice)
        return Response(status=204)

    session_id = None
    if str(model_choice) == "0":
        session_id = "cooking"
    elif str(model_choice) == "3":
        session_id = "medicine"
    elif str(model_choice) == "4":
        session_id = "travel"
    else:
        return Response(status=204)
    print(session_id)
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


@app.route('/load_address', methods=['GET'])
async def load_address():
    #data = await request.get_json()
    global user_input
    user_input = request.args.get('input')

    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    # result = parser.parse_navigation_request(user_input)
    # return jsonify({"message": result})
    async def generate():
        async for res in parser.parse_navigation_request(user_input):
            print(f"Yielding response chunk: {res}")  # Debug print
            yield f"data: {json.dumps({'processed': res})}\n\n"
        yield f"data: {json.dumps({'processed': '[DONE]'})}\n\n"  # End of stream

    return Response(generate(), content_type='text/event-stream')


@app.route('/route_process', methods=['GET'])
async def route_process():
    #data = await request.get_json()
    global user_input
    user_input = request.args.get('input')

    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    async def generate():
        async for res in extractor.extract_navigation_info(user_input):
            print(f"Yielding response chunk: {res}")  # Debug print
            yield f"data: {json.dumps({'processed': res})}\n\n"
        yield f"data: {json.dumps({'processed': '[DONE]'})}\n\n"  # End of stream

    return Response(generate(), content_type='text/event-stream')


# 文生图
@app.route('/call_ttp', methods=['POST'])
async def call_ttp():
    data = await request.get_json()
    prompt = data.get('prompt', '')
    if prompt:
        #print("prompt", prompt)
        url = Text_to_Photo.TTP(prompt)
        return jsonify({'url': url})
    else:
        return jsonify({'error': 'Invalid input'}), 400


if __name__ == '__main__':
    app.run(debug=True, port=5001)







