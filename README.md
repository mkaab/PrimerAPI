
### Implementation

Workflow was implemented through dashboard.

Authorizing a capturable payment intent.

Import the method and types
Access the response properties upon a successful response.



### Installation

```bash
$ git clone git@github.com:mkaab/PrimerAPI

```

Install the dependencies using yarn or npm.

```bash
# With yarn
$ yarn

# With npm
$ npm i
```



Clone `env.example` and name the cloned file `.env`.

```
$ cp env.example .env
```

Open `.env` and set the environment variable `API_KEY` with the API key available on your dashboard.

```
API_KEY=1234-1234-1234-1234 # Your Primer API Key
```

### Run the server

```bash
# With yarn
$ yarn start

# With npm
$ npm start
```
We are using a test token for this example which returns authorized status for all payments made by card in GBP.

The server is deployed on port 8880 by default. You can change the port by setting the `PORT` environment variable in the `.env` file.

### Access the checkout

Check the checkout at [http://localhost:8880/](http://localhost:8880/).

![Checkout UI](./images/checkout.png)
