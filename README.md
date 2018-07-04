# graphql-mongo-demo
A GraphQL Node Server based on `mongoose`, `graphql-yoga` using es6
## Get Started
- Clone this repo
`git clone https://github.com/gaohuifeng/graphql-mongo-demo.git`
- cd into the project
`cd graphql-mongo-demo`
- npm install
- npm start
- Open http://localhost:4000
- Run the sample query
- branch: feature/dataloader, use dataloader solve n+1 problem
```
query {
  articles(page: 1, size: 10) {
    id
    text
    isPublished
    author {
      name
    }
    comments {
      id
      desc
      author {
        name
      }
    }
  }
}
```
