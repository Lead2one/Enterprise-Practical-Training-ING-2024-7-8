# 语音识别包
# 语音助手的名字，可以自己设定,初始默认为小爱同学
assistant: [5] = ['小爱同学', '小孩同学', '小爱', '你好小爱', '小爱同学']
# 开启语音对话后当前语音内容
assistant_text = '闲置模式'

import pyaudio
import dashscope
import time
from dashscope.audio.asr import (Recognition, RecognitionCallback,
                                 RecognitionResult)

dashscope.api_key = 'sk-e8b1f9b79e0a43f68c00a1ca70b667ee'

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

        global assistant_text
        if str(result.get_sentence().get('text')).__contains__(assistant_text):
            assistant_text = result.get_sentence().get('text')
        else:
            assistant_text = assistant_text + result.get_sentence().get('text')
        print("assistant_text: ", assistant_text)


callback = Callback()
recognition = Recognition(model='paraformer-realtime-v2',
                          format='pcm',
                          sample_rate=16000,
                          disfluency_removal_enabled=True,
                          callback=callback)

# 1.语音助手
# 1.1语音助手待机状态
def asr_continue():
    recognition.start()
    while True:
        global assistant_text
        global assistant
        if stream:
            assistant_text = ""
            data = stream.read(3200, exception_on_overflow=False)
            recognition.send_audio_frame(data)

            for i in range(5):
                if assistant[i] in assistant_text:
                    print(i, "唤醒语音助手")
                    recognition.stop()
                    return "rewake"
        else:
            print("stream流丢失")
            break