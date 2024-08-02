# 文本转语音包

# 函数1  tts(string text) 将文本转化成语音并输出
# 函数2  change_model() 转换语音音色

import dashscope
import sys
import pyaudio
import random
from dashscope.api_entities.dashscope_response import SpeechSynthesisResponse
from dashscope.audio.tts import ResultCallback, SpeechSynthesizer, SpeechSynthesisResult

dashscope.api_key='sk-555645a2cb964449b0ca13475d0041cc'
model: [] = [
    # 女
    'sambert-zhiwei-v1',
    'sambert-zhijia-v1',
    'sambert-zhiying-v1',
    'sambert-zhiyuan-v1',
    'sambert-zhiyue-v1',
    # 男
    'sambert-zhixiang-v1',
    'sambert-zhiming-v1',
    'sambert-zhimo-v1'
]
model_index = 0

text: [] = [
    '我的声音好听吗？',
    '这个声音怎么样？',
    '喂，听得到吗？'
]

class Callback(ResultCallback):
    _player = None
    _stream = None

    def on_open(self):
        print('Speech synthesizer is opened.')
        self._player = pyaudio.PyAudio()
        self._stream = self._player.open(
            format=pyaudio.paInt16,
            channels=1,
            rate=48000,
            output=True)

    def on_complete(self):
        print('Speech synthesizer is completed.')

    def on_error(self, response: SpeechSynthesisResponse):
        print('Speech synthesizer failed, response is %s' % (str(response)))

    def on_close(self):
        print('Speech synthesizer is closed.')
        self._stream.stop_stream()
        self._stream.close()
        self._player.terminate()

    def on_event(self, result: SpeechSynthesisResult):
        if result.get_audio_frame() is not None:
            print('audio result length:', sys.getsizeof(result.get_audio_frame()))
            self._stream.write(result.get_audio_frame())

        if result.get_timestamp() is not None:
            print('timestamp result:', str(result.get_timestamp()))

callback = Callback()
def tts(text):
    global callback
    global model_index
    global model
    callback = Callback()
    print("TTS.tts-begin")
    SpeechSynthesizer.call(model=model[model_index],
                           text=text,
                           sample_rate=48000,
                           format='pcm',
                           callback=callback)
    print("TTS.tts-end")

def change_model():
    global model_index
    model_index = (model_index + 1) % len(model)
    text_index = random.randint(0, len(text) - 1)
    tts(text=text[text_index])
    return model_index





