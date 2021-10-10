<p align="center">
    <img src="https://user-images.githubusercontent.com/52280338/136693162-249a4553-430b-40d5-9d7f-7f5e59a53236.png" alt="mu-node-authentication" />
</p>
<h1 align="center">mu-node-storage-service</h1>
<h2 align="center">File storage service for Semantic.Works</h2>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="license: MIT" />
  </a>
  </a>
</p>

---

## Functionality:

- 📂 Upload
- ⏬ Download

## Core Features:

- :page_with_curl: JSON:API compliant
- 🌴 AWS & MINIO ready
- :o: Semantic.works ready
- :computer: Written 100% in Javascript

# :open_book: Documentation

## Note
This service is just experimantal and not production ready. Made to play around with the possibilities of object storage. For a production ready file storage service, head over to the [mu-semtech/file-service](https://github.com/mu-semtech/file-service).

## Description
This service lets you save your file using object storage. It can both be used with AWS s3 and MINIO. The model is almost identical to the [mu-semtech/file-service](https://github.com/mu-semtech/file-service), with the sole difference being how/where the files are being saved. 

## Getting Started

### Add to your semantic.works stack
- Add the following service to your docker-compose.yml file: 
```yml
  storage: 
    image: mu-node-storage-service
    environment:
      ACCESS_KEY_ID: "awskeyid"
      SECRET_ACCESS_KEY: "awspass"
      BUCKET_ENDPOINT: "aws.endpoint.com"
      BUCKET_NAME: "awesomebucket"
    labels:
      - "logging=true"
    restart: always
    logging: *default-logging
```
- Add the following routes to your **config/dispatcher/dispatcher.ex** file: 
```elixir
  match "/files/*path", %{ layer: :api_services, accept: %{ any: true } } do
    forward conn, path, "http://storage/files/"
  end
```
- Create a file called **master-file-domain.lisp** under **config/resources** and paste the following code into the file:
```lisp
   (define-resource file ()
      :class (s-prefix "nfo:FileDataObject")
      :properties `((:filename :string ,(s-prefix "nfo:fileName"))
                    (:format :string ,(s-prefix "dct:format"))
                    (:size :number ,(s-prefix "nfo:fileSize"))
                    (:extension :string ,(s-prefix "dbpedia:fileExtension"))
                    (:created :datetime ,(s-prefix "nfo:fileCreated")))
      :has-one `((file :via ,(s-prefix "nie:dataSource")
                       :inverse t
                       :as "download")
                  (file-address :via ,(s-prefix "nie:dataSource")
                                :as "data-source")
                  (data-container :via ,(s-prefix "task:hasFile")
                    :inverse t
                    :as "data-container")
                  (email :via ,(s-prefix "email:hasEmail")
                      :as "email"))
      :resource-base (s-url "http://data.lblod.info/files/")
      :features `(no-pagination-defaults include-uri)
      :on-path "files")

    (define-resource file-address ()
      :class (s-prefix "ext:FileAddress")
      :properties `((:address :url ,(s-prefix "ext:fileAddress")))
      :has-one `(
                  (file :via ,(s-prefix "nie:dataSource")
                        :inverse t
                        :as "replicated-file"))
      :resource-base (s-url "http://data.lblod.info/file-addresses/")
      :features `(no-pagination-defaults include-uri)
      :on-path "file-addresses")

    (define-resource remote-url ()
     :class (s-prefix "nfo:RemoteDataObject")
     :properties `((:address :url ,(s-prefix "nie:url"))
                   (:created :datetime ,(s-prefix "dct:created"))
                   (:modified :datetime ,(s-prefix "dct:modified"))
                   (:download-status :url ,(s-prefix "adms:status"))
                   (:creator :url ,(s-prefix "dct:creator"))
                   )
     :has-one `(
       (file :via ,(s-prefix "nie:dataSource")
                      :inverse t
                      :as "download")
                      )
     :resource-base (s-url "http://lblod.data.gift/id/remote-urls/")
     :features `(include-uri)
     :on-path "remote-urls")
```
- In your **config/resources/repository.lisp** file, add the following prefixes
 ```lisp
    (add-prefix "nfo" "http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#")
    (add-prefix "nie" "http://www.semanticdesktop.org/ontologies/2007/01/19/nie#")
    (add-prefix "dct" "http://purl.org/dc/terms/")
    (add-prefix "dbpedia" "http://dbpedia.org/ontology/")
```

- Finally add the following line to your **config/resources/domain.lisp** file
```
    (read-domain-file "master-files-domain.lisp")
```
- When that is done, run `docker-compose up -d`
If you set this up locally then by default your app will be made available on `http://localhost:80`

### MinIO
This service is compatible with [MinIO](https://min.io/). MinIO is open-source and provides 'High Performance Object Storage'. To use this service you can either spin up a MinIO server or add the MinIO image to your stack. The following steps will show you how to add MinIO to you docker-compose file:

- Add minio to your docker-compose services:
 ```yml
    minio:
      image: 'minio/minio'
      command: server /data --console-address ":9001"
      ports:
        - 9000:9000
        - 9001:9001 
      volumes:
        - ./data/files:/data
      environment:
        MINIO_ROOT_USER: minio
        MINIO_ROOT_PASSWORD: minio123
  ```
 The MINIO_ROOT_USER & MINIO_ROOT_PASSWORD will need correspond to the ACCESS_KEY_ID & SECRET_ACCESS_KEY key of the storage service respectivly. 

- run `docker-compose up` and open your browser at `http://localhost:9001`. This will open the MinIO console. Enter the credentials you specified in the environment variables.
- You should now be presented the minIO UI. Head over to your buckets and create a new one. note: the name you give to the new bucket will need to correspond to the BUCKET_NAME key of the storage service. 


- You should now have your minio server spun up with bucket you can use to store your files. BUCKET_ENPOINT for the storage service will equal to `minio:9000`

# :orange_heart: Contributing

Everyone can open an issue or send in a pull request.


# 📝 License

This project is [MIT](LICENSE) licensed.
