#!/bin/bash

npm run build
scp -r dist/* quant:/usr/share/nginx/html/
