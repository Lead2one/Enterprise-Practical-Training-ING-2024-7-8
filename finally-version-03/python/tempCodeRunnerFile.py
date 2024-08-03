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