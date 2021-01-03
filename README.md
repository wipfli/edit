# edit
Edit data stored on ballometer.io

## Installation

Write a ```edit.service``` file with the JWT secret:

```
[Unit]
Description=Node express server for editing data stored on ballometer.io

[Service]
WorkingDirectory=/root/edit
Environment=PORT=3003
Environment=JWT_SECRET="your-secret"
ExecStart=node index.js
Restart=always
TimeoutStopSec=30

[Install]
WantedBy=multi-user.target
```

```bash
npm install
```

test with

```bash
JWT_SECRET="your-secret" PORT=3003 node index.js
```

install with

```bash
systemctl enable /root/edit/edit.service
systemctl start edit
```