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

To stop the docker containers, run the following command:
```
docker compose down
```

### Application

<img width="1727" height="961" alt="image" src="https://github.com/user-attachments/assets/886d9c87-5741-40d3-9eb6-de7ff6602291" />


Application can be interacted with in two ways:
- Enter number of requests to be created per click and press desired endpoint button
- Select range for requests to be created per second and enable auto-traffic simulation

### Grafana

<img width="1727" height="947" alt="image" src="https://github.com/user-attachments/assets/9033fedc-7724-4d13-96b8-91817eec36c2" />


Grafana dashboard currently contains two tabs:
- Service Health: Contains metrics such as Breakdown of Status Codes, Error Metrics, Latency Metrics, Request Metrics and more.
- Resources and Processes: Contains Uptime Metrics, App Metrics, Event Loop Lag, Garbage Collection and Active Handles and Requests.

## Authors

Devin Rathod
