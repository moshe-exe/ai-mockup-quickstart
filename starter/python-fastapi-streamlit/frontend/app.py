"""
Streamlit chat UI for the mockup.

Conversation history lives in st.session_state. Each turn posts the full
history to the backend's /chat endpoint and renders the reply.
"""

import os

import requests
import streamlit as st

# ────────────────────────────────────────────────────────────────────
# CHANGE ME — App title shown in the browser tab and at the top.
# ────────────────────────────────────────────────────────────────────
APP_TITLE = "Mockup"


BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:8000")

st.set_page_config(page_title=APP_TITLE, page_icon="💬", layout="centered")
st.title(APP_TITLE)

# Initialize history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Render history
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# Input
if prompt := st.chat_input("Type a message…"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        with st.spinner("Thinking…"):
            try:
                response = requests.post(
                    f"{BACKEND_URL}/chat",
                    json={"messages": st.session_state.messages},
                    timeout=60,
                )
                response.raise_for_status()
                reply = response.json()["message"]
            except requests.RequestException as exc:
                reply = f"⚠️ Backend error: {exc}"

            st.markdown(reply)

    st.session_state.messages.append({"role": "assistant", "content": reply})
