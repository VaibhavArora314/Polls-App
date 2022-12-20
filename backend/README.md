## Instructions
To set up the backend locally on your system, make sure you have python version >= 3.8 and pip3.
1. After cloning this repo, go to the backend folder.
2. In the polls folder create a .env file to specify your database details like shown in the .env.example
```
SECRET_KEY=
DEBUG=
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
```
In case you do not want to specify DB details and want to use sqlite3 DB then uncomment lines 90-95 in settings.py in the polls folder.
```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    },
}
```
Also, comment lines 100-109 in settings.py in the polls folder.
```
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': os.environ.get('DB_NAME'),
#         'HOST': os.environ.get('DB_HOST'),
#         'PORT': os.environ.get('DB_PORT'),
#         'USER': os.environ.get('DB_USER'),
#         'PASSWORD': os.environ.get('DB_PASSWORD'),
#     }
# }
```
3. Run the following commands in the backend folder<br/>
    a. <code>pip3 manage.py makemigration</code> to create migrations<br/>
    b. <code>pip3 manage.py migrate</code> to apply migration<br/>
    c. <code>python3 manage.py runserver</code> to run server on your local machine<br/>



## Documentation
There are the following endpoints available
1. /api/polls: This endpoint has permissions set to AuthenticatedOrReadOnly so you can send get request if you are not authenticated.<br/>
GET: On sending a get request it returns a JSON object of the list of polls objects. Ex:
```
[
    {
        "id": 1,
        "user": 1,
        "username": "admin123",
        "description": "test poll",
        "live_results": true,
        "time_left": "27 days",
        "options": [
            {
                "id": 1,
                "poll": 1,
                "votes_count": 3,
                "description": "1"
            },
            {
                "id": 2,
                "poll": 1,
                "votes_count": 1,
                "description": "2"
            },
            {
                "id": 3,
                "poll": 1,
                "votes_count": 0,
                "description": "3"
            },
            {
                "id": 4,
                "poll": 1,
                "votes_count": 2,
                "description": "4"
            }
        ],
        "ended": false
    },
    {
        "id": 2,
        "user": 1,
        "username": "admin",
        "description": "test 2",
        "live_results": false,
        "time_left": "4 days",
        "options": [
            {
                "id": 6,
                "poll": 2,
                "votes_count": 0,
                "description": "abcdefghig"
            },
            {
                "id": 7,
                "poll": 2,
                "votes_count": 4,
                "description": "klmnopqrst"
            },
            {
                "id": 8,
                "poll": 2,
                "votes_count": 2,
                "description": "uvwxyz"
            }
        ],
        "ended": false
    },
]
```
POST: For authentication, we need to specify the JSON web token in the request headers. The body of the request should be like this:
```
{
    "user": 1,
    "description": "hey this is a test poll",
    "live_results": true,
    "time_period": 2,
    "options": [
        {"description": "option1"},
        {"description": "option2"}
    ]
}
```
Here we must specify the user id of the account we are currently using. In case we specify the wrong user id which belongs to another account then the Django application will overwrite the user to the current user id of the account we are using. In case of all the data is correct we will get a response of status 201 containing the polls body. Ex:
```
{
    "id": 5,
    "user": 1,
    "description": "hey this is a test poll",
    "live_results": true,
    "time_period": 2.0,
    "options": [
        {
            "id": 15,
            "poll": 5,
            "votes_count": 0,
            "description": "option1"
        },
        {
            "id": 16,
            "poll": 5,
            "votes_count": 0,
            "description": "option2"
        }
    ]
}
```

2. /api/polls/:id : To access this endpoint you may not be authenticated.<br/>
GET: This returns the body of the poll if exists with status 200 else a response with status 404. Ex:
```
{
    "id": 3,
    "user": 1,
    "username": "Vaibhav",
    "description": "test 3",
    "live_results": true,
    "time_left": "Ended",
    "options": [
        {
            "id": 9,
            "poll": 3,
            "votes_count": 1,
            "description": "abcdefghij"
        },
        {
            "id": 10,
            "poll": 3,
            "votes_count": 1,
            "description": "klmnopqrst"
        },
        {
            "id": 11,
            "poll": 3,
            "votes_count": 0,
            "description": "uvwxyz"
        }
    ],
    "ended": true
}
```

3. /api/votes: To access this endpoint you must be authenticated.<br/>
POST: We can send a post request to this endpoint to create a vote object. The body of the request should be like this:
```
{
    "poll": 2,
    "option": 5,
    "user": 1
}
```
Here also we must specify the user id of the account we are currently using. In case we specify the wrong user id which belongs to another account then the Django application will overwrite the user to the current user id of the account we are using. Also in case, we specify an option that does not belong to this poll then we will get a response of status 404. In case of all the data is correct we will get a response of status 201 containing the vote object's body.<br/>

4. /api/votes/:id : To access this endpoint you must be authenticated.<br/>
GET: Here we get the vote object of the current user and specified poll id if exists else response with status 404. Ex:
```
{
    "poll": 1,
    "option": 2,
    "user": 4
}
```
PUT/PATCH: We can send a put or patch request to update the votes object. <br/>

5. /api/auth/jwt/create<br/>
This endpoint is used to create JSON web tokens. Read about it in official [documentation](https://djoser.readthedocs.io/en/latest/jwt_endpoints.html#jwt-create) <br/>

6. /api/auth/jwt/refresh<br/>
This endpoint is used to refresh JSON web tokens. Read about it in official [documentation](https://djoser.readthedocs.io/en/latest/jwt_endpoints.html#jwt-refresh) <br/>

There are various other endpoints available with [Djoser](https://djoser.readthedocs.io/en/latest/getting_started.html#available-endpoints)
