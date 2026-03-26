import urllib.request, json

endpoints = [
    '/api/metrics', '/api/metrics/history', '/api/predict',
    '/api/anomalies', '/api/actions', '/api/status'
]

for ep in endpoints:
    url = f'http://localhost:5000{ep}'
    try:
        res = urllib.request.urlopen(url).read()
        print(f'{ep}: OK - length {len(res)}')
    except Exception as e:
        print(f'{ep}: ERROR - {e}')

def test_post(ep, data):
    url = f'http://localhost:5000{ep}'
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        res = urllib.request.urlopen(req).read()
        print(f'POST {ep}: OK - {res.decode()}')
    except Exception as e:
        print(f'POST {ep}: ERROR - {e}')

test_post('/api/simulate/cpu', {'action': 'start'})
import time
time.sleep(2)
test_post('/api/simulate/cpu', {'action': 'stop'})

test_post('/api/simulate/memory', {'action': 'start'})
time.sleep(2)
test_post('/api/simulate/memory', {'action': 'stop'})
