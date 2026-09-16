#!/usr/bin/env python3
"""Lokale previewserver voor Impact Connect.

Alleen voor ontwikkelen — de site zelf is gewone HTML en heeft dit niet nodig.
Deze server zet caching uit, zodat je elke wijziging meteen ziet na verversen.

    python3 serve.py
    open http://127.0.0.1:8124
"""

import http.server
import os
import socketserver

PORT = 8124
ROOT = os.path.dirname(os.path.abspath(__file__))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # stil houden


if __name__ == "__main__":
    # Met threads: een browser die een verbinding openhoudt zonder iets te
    # vragen, blokkeert anders alle andere verzoeken en lijkt de server dood.
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    socketserver.ThreadingTCPServer.daemon_threads = True
    with socketserver.ThreadingTCPServer(("127.0.0.1", PORT), NoCacheHandler) as httpd:
        print(f"Impact Connect draait op http://127.0.0.1:{PORT}")
        print("Stoppen met Ctrl+C.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nGestopt.")
