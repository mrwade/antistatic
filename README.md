# Antistatic

Not-so-static site server.

## Features

- Multi-domain static site serving from a single S3 bucket

## Bucket Setup

Upload static site files to your S3 bucket using the hostname as root directories:

- example.com
  - about-us.html
  - index.html
- anotherexample.com
  - index.html

The S3 path of `my-bucket/example.com/about-us.html` will translate to the URL `http://example.com/about-us.html`.

## Server Setup

You'll need to configure Antistatic through a few environment variables. (See [.env.sample](/.env.sample))

*Required:*
- `BUCKET`: Name of your S3 bucket

*Optional:*
- `PORT`: Port for server. (Default: 5000)

## Running

Run with: `BUCKET=my-s3-bucket-name PORT=3000 npm start`
