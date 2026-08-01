import sys
import os

# Add api directory to sys.path for serverless execution
sys.path.insert(0, os.path.dirname(__file__))

from main import app

# Vercel looks for the ASGI/WSGI app instance
handler = app
