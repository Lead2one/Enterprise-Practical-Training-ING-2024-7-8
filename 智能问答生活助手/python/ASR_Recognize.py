# # 语音识别包
# # 语音助手的名字，可以自己设定,初始默认为小爱同学
# assistant: [5] = ['小爱同学', '小爱同学', '小爱同学', '小爱同学', '小爱同学']
# # 开启语音对话后当前语音内容
# assistant_text = '闲置模式'

# # 用来表示用户按钮按下或松开，按下开始记录时间
# button: bool = False
# # 用户按钮开启后录音内容
# button_text: str = '用户按钮录音'


# import pyaudio
# import dashscope
# import time
# from dashscope.audio.asr import (Recognition, RecognitionCallback,
#                                  RecognitionResult)

# dashscope.api_key='sk-6f1b2e685c5043c4af0cf862f7bac58e'


# mic = None
# stream = None
# class Callback(RecognitionCallback):
#     def on_open(self) -> None:
#         global mic
#         global stream
#         print('RecognitionCallback open.')
#         mic = pyaudio.PyAudio()
#         stream = mic.open(format=pyaudio.paInt16,
#                           channels=1,
#                           rate=16000,
#                           input=True)

#     def on_close(self) -> None:
#         global mic
#         global stream
#         print('RecognitionCallback close.')
#         stream.stop_stream()
#         stream.close()
#         mic.terminate()
#         stream = None
#         mic = None

#     def on_event(self, result: RecognitionResult) -> None:
#         print('RecognitionCallback sentence: ', result.get_sentence())
#         print('Result: ',result.get_sentence().get('text'))

#         global assistant_text
#         if str(result.get_sentence().get('text')).__contains__(assistant_text):
#             assistant_text = result.get_sentence().get('text')
#         else:
#             assistant_text = assistant_text + result.get_sentence().get('text')
#         print("assistant_text: ", assistant_text)

#         global button
#         if button :
#             global button_text
#             if str(result.get_sentence().get('text')).__contains__(button_text):
#                 button_text = result.get_sentence().get('text')
#             else:
#                 button_text = button_text + result.get_sentence().get('text')
#             print("button_text: ", button_text)
        
        

# callback = Callback()
# recognition = Recognition(model='paraformer-realtime-v2',
#                           format='pcm',
#                           sample_rate=16000,
#                           disfluency_removal_enabled = True,
#                           callback=callback)
# # recognition.start()

# # 1.语音助手
# # 1.1语音助手待机状态
# def asr_continue():
#     recognition.start()
#     while True:
#         global assistant_text
#         global assistant
#         if stream:
#             assistant_text = ""
#             data = stream.read(3200, exception_on_overflow=False)
#             recognition.send_audio_frame(data)

#             for i in range(5):
#                 if assistant[i] in assistant_text:
#                     print(i,"唤醒语音助手")
#                     recognition.stop()
#                     return "rewake"
#         else:
#             print("stream流丢失")
#             break
# # def 
# # 1.2语音助手识别状态
# # def asr_current():
# #     start_time = time.time()
# #     global assistant_text
# #     assistant_text = ''
# #     # 记录7秒内用户所说的问题，后续可改为用户按钮来决定开启或暂停

# #     while time.time() - start_time < 7:
# #         if stream:
# #             data = stream.read(3200, exception_on_overflow=False)
# #             recognition.send_audio_frame(data)
# #         else:
# #             break

# #     print("assistant_text: ", assistant_text)
# #     return assistant_text

# # 2.按钮语音识别
# # 2.1 持续检测按钮状态
# def button_pressed():
#     global button
#     button = not(button)

# def button_get_result():
#     global button
#     global button_text
#     button = True
#     button_text = ''
#     print("开去语音输入")

#     recognition.start()
#     while button:
#         if stream:
#             data = stream.read(3200, exception_on_overflow=False)
#             recognition.send_audio_frame(data)
#         else:
#             break
#     recognition.stop()
#     return button_text

# # 3. 给语音助手重命名
# # def name_assistant_by_audio():
# #     # 每四秒记录一次，后续可改为用户按钮来决定开启或暂停

# #     start_time = time.time()
# #     for i in range(5):
# #         print("当前为第", i, "次记录")
# #         global result_text
# #         result_text = ''

# #         while time.time() - start_time < 4:
# #             if stream:
# #                 data = stream.read(3200, exception_on_overflow=False)
# #                 recognition.send_audio_frame(data)
# #             else:
# #                 break

# #         assistant[i] = result_text
# #         print("第", i, "次记录结束，结果为：", result_text)


# # recognition.stop()


# 语音识别包

# 用来表示用户按钮按下或松开，按下开始记录时间
button: bool = False
# 用户按钮开启后录音内容
button_text: str = '用户按钮录音'

import pyaudio
import dashscope
import time
from dashscope.audio.asr import (Recognition, RecognitionCallback,
                                 RecognitionResult)

dashscope.api_key = 'sk-08bed418980b49a38481ab3272126025'

mic = None
stream = None


class Callback(RecognitionCallback):
    def on_open(self) -> None:
        global mic
        global stream
        print('RecognitionCallback open.')
        mic = pyaudio.PyAudio()
        stream = mic.open(format=pyaudio.paInt16,
                          channels=1,
                          rate=16000,
                          input=True)

    def on_close(self) -> None:
        global mic
        global stream
        print('RecognitionCallback close.')
        stream.stop_stream()
        stream.close()
        mic.terminate()
        stream = None
        mic = None

    def on_event(self, result: RecognitionResult) -> None:
        print('RecognitionCallback sentence: ', result.get_sentence())
        print('Result: ', result.get_sentence().get('text'))
        global button_text
        button_text = result.get_sentence().get('text')

        # global button
        # if button:
        #     global button_text
        #     if str(result.get_sentence().get('text')).__contains__(button_text):
        #         button_text = result.get_sentence().get('text')
        #     else:
        #         button_text = button_text + result.get_sentence().get('text')
        #     print("button_text: ", button_text)


callback = Callback()
recognition = Recognition(model='paraformer-realtime-v2',
                          format='pcm',
                          sample_rate=16000,
                          disfluency_removal_enabled=True,
                          callback=callback)

# 2.按钮语音识别
# 2.1 持续检测按钮状态
def button_pressed():
    global button
    button = not (button)


def button_get_result():
    global button
    global button_text
    button = True
    button_text = ''
    print("开起语音输入")

    recognition.start()
    while button:
        if stream:
            data = stream.read(3200, exception_on_overflow=False)
            recognition.send_audio_frame(data)
        else:
            break
    recognition.stop()
    return button_text

