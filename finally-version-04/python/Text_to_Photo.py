# 文生图模型
from http import HTTPStatus
from urllib.parse import urlparse, unquote
from pathlib import PurePosixPath
import requests
from dashscope import ImageSynthesis
import dashscope

dashscope.api_key='sk-555645a2cb964449b0ca13475d0041cc'
def simple_call(prompt):
    prompt = prompt
    rsp = ImageSynthesis.call(model=ImageSynthesis.Models.wanx_v1,
                              prompt=prompt,
                              n=1,
                              size='1024*1024')
    if rsp.status_code == HTTPStatus.OK:
        print("rsp.output", type(rsp.output))
        print(rsp.output)

        print("results", type(rsp.output.results))
        print(rsp.output.results)

        print("rsp.usage", rsp.usage)

        url = rsp.output.results[0].url
        print("urls", url)

        # save file to current directory
        # for result in rsp.output.results:
        #     file_name = PurePosixPath(unquote(urlparse(result.url).path)).parts[-1]
        #     with open('./%s' % file_name, 'wb+') as f:
        #         f.write(requests.get(result.url).content)

        return url

    else:
        print('Failed, status_code: %s, code: %s, message: %s' %
              (rsp.status_code, rsp.code, rsp.message))


def TTP(prompt):
    url = simple_call(prompt)
    return url


prompt = 'the most beautiful scene you think'
TTP(prompt)