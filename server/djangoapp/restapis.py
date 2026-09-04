import os
import logging
import requests
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

backend_url = os.getenv('BACKEND_URL', os.getenv('backend_url', "http://localhost:3030")).rstrip('/')
sentiment_analyzer_url = os.getenv(
    'SENTIMENT_ANALYZER_URL',
    os.getenv('sentiment_analyzer_url', "http://localhost:5050"),
).rstrip('/')


def get_request(endpoint, **kwargs):
    """Send a GET request to the Node.js backend microservice."""
    try:
        response = requests.get(backend_url + endpoint, params=kwargs, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as err:
        logger.error("Network exception occurred during GET: %s", err)
        return None


def analyze_review_sentiments(text):
    """Analyze review sentiment using the Flask sentiment analyzer microservice."""
    request_url = sentiment_analyzer_url + "/analyze/" + text
    try:
        response = requests.get(request_url, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as err:
        logger.error("Network exception occurred during sentiment analysis: %s", err)
        return None


def post_review(data_dict):
    """Post a new review payload to the backend database microservice."""
    request_url = backend_url + "/insert_review"
    try:
        response = requests.post(request_url, json=data_dict, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as err:
        logger.error("Network exception occurred during POST: %s", err)
        return None
        return {"status": 500, "message": "Network error while posting review"}