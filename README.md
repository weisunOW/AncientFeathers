# Ancient Feathers

This is the Node.js application of the mock services for ANZ 2019 Hackathon - Team Ancient Feathers

## Configuration

This mock server is configured by `package.json`.

### Dependencies

* express
* cors
* body-parser
* colors
* uuid

### Install Dependencies

Run `npm install` to install all node module dependencies

### Execute Mock Server

Run

```bash
node  ./mock_server/services/af-services.js
```

**OR**

Inside `./mock_server/` folder, run;

```bash
npm start
```

## Containerization

This mock server can also be containerized using Docker, see the provided `Dockerfile`.

### Create Docker Image

```bash
docker build -t #{docker-image-tag} #{path/to/the/folder}
```

E.g. Under root directory of the repository, run;

```bash
docker build -t ancient_feathers/mock_server ./mock_server/
```

### Start Mock Server In Container

```bash
docker run -p #{external-port}:#{internal-port} -d #{docker-image-tag}
```

*Note: the the RESTful services of this mock server are listening on port 5000, `-p #{external-port}:#{internal-port}` will map external port to internal port inside the container* 

E.g.

```bash
docker run -p 80:5000 -d ancient_feathers/mock_server
```