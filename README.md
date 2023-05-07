# Setup instructions  

## Backend
1. Create virtual environment: ```python3 -m venv myenv```
2. Run virtual environment: ```source myenv/bin/activate```
3. Install dependencies:  
```pip install -r requirements.txt```  
Posible error: Error building wheels for packages ```pip install --upgrade setuptools```  
4. Apply migrations: ```python manage.py migrate```   
Possible error: CommandError: Conflicting migrations detected: ```python manage.py makemigrations --merge```  
After the previous command we execute again ```python manage.py migrate```  
5. Run server: ```python manage.py runserver```  
Posible errors in the browser console:
Refused to apply style from '127.0.0.1:8000/static/css/main.0c528e6d.chunk.css' because its MIME type ('text/html') is not a supported stylesheet MIME type, and strict MIME checking is enabled,  
GET /static/js/main.d8528d5f.chunk.js net::ERR_ABORTED 404 (Not Found),  
GET /static/js/2.d0132649.chunk.js net::ERR_ABORTED 404 (Not Found),  
And others more related to static files that were not found  
To solve this error enter ```python manage.py collectstatic```

## Frontend
1. Install dependencies: ```npm install```
2. Run project: ```npm start```
