"""Minimal HTTP inference service contract for future OpenCV/YOLO integration.
This demonstration provider is intentionally deterministic; it is not a trained road-defect model.
"""
from http.server import BaseHTTPRequestHandler, HTTPServer
import json, time

class DetectionProvider:
    def detect(self, request): raise NotImplementedError

class DemoDetectionProvider(DetectionProvider):
    def detect(self, request):
        label = request.get('requested_type', 'pothole')
        return {'detections':[{'type':label,'confidence':0.86,'bbox':[0.32,0.48,0.28,0.22]}], 'provider':'DemoDetectionProvider', 'model':'deterministic-demo-adapter', 'inference_ms':28}

provider = DemoDetectionProvider()
class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health': self.reply({'status':'ok','provider':provider.__class__.__name__})
        else: self.send_error(404)
    def do_POST(self):
        if self.path != '/infer': return self.send_error(404)
        size=int(self.headers.get('Content-Length','0')); self.reply(provider.detect(json.loads(self.rfile.read(size) or '{}')))
    def reply(self, payload):
        body=json.dumps(payload).encode(); self.send_response(200); self.send_header('Content-Type','application/json'); self.send_header('Content-Length',str(len(body))); self.end_headers(); self.wfile.write(body)
if __name__ == '__main__':
    print('AI demo inference API listening at http://localhost:8001'); HTTPServer(('0.0.0.0',8001),Handler).serve_forever()
