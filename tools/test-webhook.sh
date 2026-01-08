#!/bin/bash

# Test the Mailgun webhook with a verification reply
# This simulates what Mailgun sends when someone replies to verify+958f2d79@mg.getghostindex.com

TIMESTAMP=$(date +%s)
TOKEN="test-token-$(date +%s)"
SIGNING_KEY="9b57d65525d13e265939a4178b258fe4"

# Generate signature
SIGNATURE=$(echo -n "${TIMESTAMP}${TOKEN}" | openssl dgst -sha256 -hmac "$SIGNING_KEY" | awk '{print $2}')

echo "Testing webhook with verification code: 958f2d79"
echo "Timestamp: $TIMESTAMP"
echo "Token: $TOKEN"
echo "Signature: $SIGNATURE"
echo ""

curl -X POST https://getghostindex.com/api/webhooks/mailgun \
  -F "timestamp=$TIMESTAMP" \
  -F "token=$TOKEN" \
  -F "signature=$SIGNATURE" \
  -F "recipient=verify+958f2d79@mg.getghostindex.com" \
  -F "sender=howard@htdstudio.net" \
  -F "from=Howard Duffy <howard@htdstudio.net>" \
  -F "subject=Re: Verify your GhostIndex report" \
  -F "body-plain=Here is my proof" \
  -F "attachment-count=0" \
  -v

echo ""
echo "Check the response above and Vercel logs for results"
