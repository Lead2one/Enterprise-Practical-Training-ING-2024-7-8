from flask import Flask, request, jsonify, send_from_directory,Response
from flask_cors import CORS
import os
import ASR_Recognize
import TTS
import json
import ASR_Listener


app = Flask(__name__)
CORS(app)

# # 获取当前文件夹的路径
# current_dir = os.path.dirname(os.path.abspath(__file__))
# # 获取上一级目录的路径
# parent_dir = os.path.abspath(os.path.join(current_dir, os.pardir))
# # 指定HTML文件所在的文件夹路径
# html_dir = os.path.join(parent_dir, 'statics')

# @app.route('/')
# def index():
#     return send_from_directory(html_dir, 'food.html')

# 连接测试函数
@app.route('/run-function', methods=['POST'])
def run_function():
    # 这里写你的函数逻辑
    result = {"message": "Function executed successfully!", "data": 42}
    return jsonify(result)

# 1.语音识别
# 1.1 开启语音识别，并将结果返回
@app.route('/audio_begin',methods=['POST'])
def audio_begin():
    print("开始录音")
    result = {"message": ASR_Recognize.button_get_result()}
    print("结束录音")
    return jsonify(result)
# 1.2结束语音识别
@app.route('/audio_end',methods=['POST'])
def audio_end():
    ASR_Recognize.button_pressed()
    result = {"message": "结束录音"}
    return jsonify(result)

# 2.助手唤醒
@app.route('/assistant_listener',methods=['POST'])
def assistant_listener():
    r = ASR_Listener.asr_continue()
    result = {"message": r}
    return jsonify(result)

# 3.切换音色
@app.route('/tone_change',methods=['POST'])
def tone_change():
    result = {"message": TTS.change_model()}
    return jsonify(result)

# 4.将文本读出
@app.route('/text_read',methods=['POST'])
def text_read():  
    data = request.get_json()
    text = data.get('text')
    print("tts",text)
    TTS.tts(text)
    result = {"message":text}
    return result


if __name__ == '__main__':
    app.run(debug=True,port=5000)



