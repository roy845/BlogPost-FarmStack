from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from . import models
from .routers import users, posts, auth, vote, voteComment, comment
from .database import engine
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

Base.metadata.create_all(bind=engine)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(posts.router)
app.include_router(auth.router)
app.include_router(vote.router)
app.include_router(voteComment.router)
app.include_router(comment.router)


@app.get("/root")
def root():
    return {"message": "Hello world"}


frontend_path = Path(__file__).resolve().parent.parent / "build"

# Serve the React app from the 'build' folder at the root path
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")
