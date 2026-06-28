#!/bin/sh
# Đảm bảo thư mục dữ liệu (volume) ghi được rồi hạ quyền xuống user 'app'.
set -e
DATA_DIR="${DATA_DIR:-/data}"
mkdir -p "$DATA_DIR"
chown -R app:app "$DATA_DIR" 2>/dev/null || true
exec su-exec app:app "$@"
