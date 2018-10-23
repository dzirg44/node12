# 12 factor node app 
## This example allows you to understand how 12 factor applications are built.

### Instruments for work with this repo
  - docker 
  - docker-compose
  - IDE (Vscode etc.)

### Steps for build this application:

- install docker
- install docker-compose
- run `docker-compose up` in  the first terminal
- run `curl http://0.0.0.0:13000/users` in another console

### Most important moments:

  - almost all configurations for this application we get from the  environment variables.
```
let mongoHost = process.env.MONGO_HOST;
```
  - all logs we send to the `stdout`

  ```
  console.log(`Connecting to url for ${attempt + 1} attempt: ${url}`);
  ```
  - we logging everything, errors, success, put, get, delete, all operations must be written in the stdout
  
  - health status for our application
    for the database:
    ```
    app.get('/readiness', (req, res) => {
      let status = isReady ? 200 : 500;
      res.sendStatus(status);
     });
    ```
    and for application:
    ```
    app.get('/health', (req, res) => {
    res.sendStatus(200);
     });
    ```

### Must have links:

  - https://12factor.net/
  - https://www.linode.com/docs/applications/containers/how-to-use-docker-compose/
  - https://docker-curriculum.com/