# Start the Application

Use three terminals from the repository root.

## 1. Start Docker services

Open Docker Desktop and confirm the Docker daemon is running. Then start MongoDB and the dealership API:

```powershell
Set-Location server/database
docker compose up -d --build
docker compose ps
```

Verify the API:

```powershell
Invoke-WebRequest http://127.0.0.1:3030/
Invoke-WebRequest http://127.0.0.1:3030/fetchDealers
```

Expected result: the API responds with HTTP 200 and dealership data is returned.

## 2. Start Django

In a second terminal:

```powershell
Set-Location server
python -m pip install -r requirements.txt
python manage.py migrate --noinput
$env:BACKEND_URL = "http://127.0.0.1:3030"
$env:SENTIMENT_ANALYZER_URL = "http://127.0.0.1:5050"
python manage.py runserver 127.0.0.1:8000
```

Django runs at http://127.0.0.1:8000/.

## 3. Start React

In a third terminal:

```powershell
Set-Location server/frontend
npm install
$env:BROWSER = "none"
npm start
```

React runs at http://127.0.0.1:3000/.

## 4. Test the application

Open http://127.0.0.1:3000/ and check:

1. Home, About, Contact, and Dealers links.
2. Dealer list and state filtering.
3. Dealer detail pages.
4. Registration, login, and logout.
5. Post-review form and review submission.

## Stop the application

Stop Django and React with `Ctrl+C`. Stop Docker services with:

```powershell
Set-Location server/database
docker compose down
```
