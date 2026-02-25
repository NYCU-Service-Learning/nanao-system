# render-api

[render website](https://render.com)

Running in dev mode:
`python main.py`

Running in production mode:
windows:
`waitress-serve --host=0.0.0.0 --port=80 main:app`
linux:
`gunicorn -b 0.0.0.0:80 main:app`