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

## Deployment to GKE
The containerized image could be deployed to GKE(google kubernete engine) given that a PROJECT has been created on GCP and a gke cluster has been created.


### Build and push the docker image to Google Container Registry 
Given that a GCP cloud shell has been running from the GKE cluster,
Run below command to create and push docker image

```bash
docker build -t gcr.io/[PROJECT_ID]/af-server:[VERSION_NUM] .
docker push gcr.io/[PROJECT_ID]/af-server:[VERSION_NUM]
```
Replace [PROJECT_ID] with the valid GCP Project ID, 
replace [VERSION_NUM] with the version number of the app, 
this number need to match the verison number in `deployment.yaml`

### Deploy docker image to kubernets
`deployment.yaml` describes containers to be deployed and will create a LoadBalancer to expose containers to the internet. 

Run below in cloud shell to create deployment and service

```bash
kubectl apply -f deployment.yaml --record
```

Check deployment process

```bash
kubectl get deployments
```

Check pods

```bash
kubectl get pods
```

Check service and copy external IP address

```bash
kubectl get services
```

### Release a new version
Push a new version of docker image to the Google Container Registry,
change docker image version in deployment.yaml and then run below command

```bash
kubectl apply -f deployment.yaml --record
```
### Uesful tips
Check container logs

```bash
kubectl logs <POD NAME>
```

Delete a whole deployment

```bash
kubectl delete deployment [DEPLOYMENT NAME]
```
