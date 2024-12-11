from fastapi import HTTPException
from openai import AsyncOpenAI as OpenAI
from dotenv import load_dotenv
import json
import os

load_dotenv()

ai = OpenAI()

ai.api_key = os.getenv("OPENAI_API_KEY")


async def generate_response(prompt: dict, to: int):
    try:
        # 입력된 메시지 내용 추출
        user_message = ""
        for content in prompt["content"]:
            user_message += content["message"] + " "

        chat = await ai.chat.completions.create(
            model="gpt-4o-mini-2024-07-18",
            messages=[{"role": "system", "content": ""}, {"role": "user", "content": user_message}],
            temperature=0.7,
            max_tokens=150,
        )
        ai_response = chat.choices[0].message.content

        # 기존 prompt의 content에 AI 응답 추가
        prompt["content"].append({
            "to": to,
            "message": ai_response
        })

        # dict를 JSON 문자열로 변환
        json_response = json.dumps(prompt, ensure_ascii=False)

        return {"to": to, "message": ai_response}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))