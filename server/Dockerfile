FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

# Install curl for healthcheck and wget for certificates
RUN apt-get -y update; \
    apt-get --no-install-recommends -y install curl=7.81.0; \
    rm -rf /var/lib/apt/lists/*


# Install dependencies
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir -r /code/requirements.txt

# Copy configuration files and code
COPY ./src/ /code/src



