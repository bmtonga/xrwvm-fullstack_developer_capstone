import json
import logging
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import CarMake, CarModel
from .populate import initiate
from .restapis import analyze_review_sentiments, get_request, post_review

logger = logging.getLogger(__name__)


@csrf_exempt
def login_user(request):
    """Handle user sign in request."""
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body)
        username = data.get('userName')
        password = data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            request.session.save()
            return JsonResponse({
                "userName": username,
                "firstName": user.first_name,
                "lastName": user.last_name,
                "status": "Authenticated"
            })
        else:
            return JsonResponse({
                "userName": username,
                "status": "Invalid Credentials"
            })
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON payload"}, status=400)


def logout_request(request):
    """Handle user sign out request."""
    logout(request)
    return JsonResponse({"userName": ""})


@csrf_exempt
def registration(request):
    """Handle user sign up request."""
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body)
        username = data.get('userName')
        password = data.get('password')
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')

        if User.objects.filter(username=username).exists():
            return JsonResponse({
                "userName": username,
                "error": "Already Registered"
            })

        user = User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            password=password,
            email=email
        )

        login(request, user)
        request.session.save()
        return JsonResponse({
            "userName": username,
            "firstName": first_name,
            "lastName": last_name,
            "status": "Authenticated"
        })
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON payload"}, status=400)


def get_cars(request):
    """Get all car models and their related car makes."""
    count = CarMake.objects.count()

    if count == 0:
        initiate()

    car_models = CarModel.objects.select_related('car_make')
    cars = []

    for car_model in car_models:
        cars.append({
            "CarModel": car_model.name,
            "CarMake": car_model.car_make.name
        })

    return JsonResponse({"CarModels": cars})


def get_dealerships(request, state="All"):
    """Get list of dealerships, filtered by state if provided."""
    if state == "All":
        endpoint = "/fetchDealers"
    else:
        endpoint = f"/fetchDealers/{state}"

    dealerships = get_request(endpoint)
    if not isinstance(dealerships, list):
        return JsonResponse(
            {"status": 502, "message": "Dealership service unavailable", "dealers": []},
            status=502,
        )
    return JsonResponse({"status": 200, "dealers": dealerships})


def get_dealer_reviews(request, dealer_id):
    """Render reviews of a specific dealer."""
    if dealer_id:
        endpoint = f"/fetchReviews/dealer/{dealer_id}"
        reviews = get_request(endpoint)
        if not isinstance(reviews, list):
            return JsonResponse(
                {"status": 502, "message": "Review service unavailable", "reviews": []},
                status=502,
            )
        if reviews:
            for review_detail in reviews:
                response = analyze_review_sentiments(review_detail.get('review', ''))
                if response and 'sentiment' in response:
                    review_detail['sentiment'] = response['sentiment']
        return JsonResponse({"status": 200, "reviews": reviews})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})


def get_dealer_details(request, dealer_id):
    """Render details of a specific dealer."""
    if dealer_id:
        endpoint = f"/fetchDealer/{dealer_id}"
        dealership = get_request(endpoint)
        if not isinstance(dealership, list):
            return JsonResponse(
                {"status": 502, "message": "Dealership service unavailable", "dealer": []},
                status=502,
            )
        return JsonResponse({"status": 200, "dealer": dealership})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})


@csrf_exempt
def add_review(request):
    """Submit a review for a dealer."""
    if request.user.is_authenticated:
        try:
            data = json.loads(request.body)
            response = post_review(data)
            if not isinstance(response, dict) or response.get("status") == 500:
                return JsonResponse(
                    {"status": 502, "message": "Review service unavailable"},
                    status=502,
                )
            return JsonResponse({"status": 200, "response": response})
        except Exception as e:
            logger.error(f"Error posting review: {e}")
            return JsonResponse({"status": 401, "message": "Error in posting review"})
    else:
        return JsonResponse({"status": 403, "message": "Unauthorized"})