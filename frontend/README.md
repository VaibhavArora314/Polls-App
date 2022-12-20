## Instructions
To run the frontend locally on your machine
1. After cloning this repo on your machine, go to the frontend folder.
2. Run <code>npm i</code> to install required dependencies.
3. Create a .env file inside the project and set the api url in it as follows. Do net specify the /api part in url, just the base url of backend application ending with /.
```
REACT_APP_API_URL=BACKEND_URL
```
If you are running backend on your local machine on port 8000 then this will be
```
REACT_APP_API_URL=http://127.0.0.1:8000/
```
4. Run <code>npm start</code> to run the frontend at <code>http://localhost:3000</code>
