# Grafana Demo

Observability Demo Application to simulate standard requests and data to be visualised on Grafana dashboards. 

## Description

To explore how Grafana can make use of metrics directly, an application was developed and utilised to pull data from. This application simulates the requests and responses that would be found within a live application, scraped by a data collector and then fed into Grafana to visualise insights through a configurable dashboard. 

This project utilises the following technologies:
- Node.js - locally starting application
- Express - serves API and static frontend
- Prometheus Client - used for data collection from application using /metrics endpoint
- HTML, JavaScript - standard for web page and app development
- CSS with Pico CSS styling - styling for sample application
- Docker - containerising application to work with prometheus client and grafana
- Grafana - monitoring tool containing dashboards for insights

## Getting Started

### Dependencies

- Node.js 18 or newer
- Docker

### Installing

To install the dependencies required for this application:
```
npm install
```

### Executing program

Ensure that docker is running, run the following command:
```
docker compose up -d
```
To start the demo application:
```
npm run dev
```

To interact with the application visit:

`localhost:3000`

To interact with the Grafana dashboard visit:

`localhost:3001`

To login enter the following credentials:

`admin` - for both username and password

**Press 'Skip' if prompted to change the password**

## Authors

Devin Rathod
