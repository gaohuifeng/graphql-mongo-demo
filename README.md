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


## 什么是GraphQL
API查询语言。 </br>
引用官方文档的一句话：ask exactly what you want.
</br>
> **GraphQL 为数据通信而生。你有一个客户端和一个服务器，它们需要相互通信。客户端需要告知服务器需要哪些数据，服务器需要用实际的数据来满足客户端的数据需求。GraphQL 是此种通信方式的中介**
</br>
rest api: 
- 端点的集合，存在多次往返的问题
- 版本控制
</br>
```
// get comment info
GET /comment/:id  
// The object frontend used to render the page
{
  "data": {
    "comment": {
      "id": "5b3c6ff29800d856a01a5d35",
      "desc": "good",
      "author": {
        "id": "5b3c6fd89800d856a01a5d33",
        "name": "吃瓜群众"
      }
    }
  }
}
```

graphql:
- 解决多次往返的问题
- 完全避免版本控制
- 强类型模式
- 使用图与数据通信
- 声明式语言
```
// GraphQL query
query {
  comment(id: "5b3c6ff29800d856a01a5d35") {
    id
    desc,
    author {
      id
      name
    }
  }
}

// returned object from GraphQL backend
{
  "data": {
    "comment": {
      "id": "5b3c6ff29800d856a01a5d35",
      "desc": "good",
      "author": {
        "id": "5b3c6fd89800d856a01a5d33",
        "name": "吃瓜群众"
      }
    }
  }
}
```

```
// GraphQL query
query {
  comment(id: "5b3c6ff29800d856a01a5d35") {
    desc,
    author {
      name
    }
  }
}

// returned object from GraphQL backend
{
  "data": {
    "comment": {
      "desc": "good",
      "author": {
        "name": "吃瓜群众"
      }
    }
  }
}
```


- REST接口: 接口返回的数据格式、数据类型都是后端预先定义好的，如果返回的数据格式并不是调用者所期望的，需要改接口或者做一些适配工作。
- graphql: 即调用者来声明接口返回什么数据，很大程度上可以进一步解耦前后端的关联。


## GraphQL实现

在GraphQL中，我们通过预先定义一张Schema和声明一些Type来达到上面提及的效果，我们需要知道：
```
Type： 数据模型的抽象，分为：Scalar Type(标量类型)，Object Type(对象类型)
Query: query（查询）、mutation（更改）和subscription（订阅）
resolver： 获取数据的逻辑
```

# Type

- Scalar Type </br>
GraphQL中的内建的标量包含，String、Int、Float、Boolean、Enum，标量是GraphQL类型系统中最小的颗粒。

- Object Type </br>
复杂的数据模型。通过对象模型来构建GraphQL中关于一个数据模型的形状，同时还可以声明各个模型之间的内在关联（一对多、一对一或多对多）

```
scalar ObjectId  // 自定义标量

type User {
  id: ObjectId
  name: String
}

type Article {
  id: ObjectId
  text: String
  isPublished: Boolean
  author: User
}

type Comment {
  id: ObjectId! // !: 类型修饰符，表示：Required
  desc: String,
  author: User!
}

type Article {
  id: ObjectId!
  text: String
  isPublished: Boolean
  author: User!
  comments: [Comment!] // []: 类型修饰符，表示：List
}
```

# Schema (Query)
描述对于接口获取数据逻辑的。 </br>
GraphQL中使用Query来抽象数据的查询逻辑，有三种查询类型: query（查询）、mutation（更改）和subscription（订阅）。</br>
</br>
分别以REST和GraphQL的角度，以User为数据模型，编写一系列CRUD的接口，如下：</br>

- Rest 接口
```
GET /api/users
GET /api/user/:id
POST /api/user
DELETE /api/user/:id
PATCH /api/user/:id
```

- GraphQL Query
```
type Query {
  user(id: ObjectId!): User
  users(page: Int, size: Int): [User]
}

type Mutation {
  createUser(
    name: String!
  ): User!
  updateUser(
    id: ObjectId!
    name: String
  ): Boolean
  deleteUser(id: ObjectId!): Boolean
}
```

# Resolver (解析函数)
提供相关Query所返回数据的逻辑。 </br>

GraphQL中，我们会有这样一个约定，Query和与之对应的Resolver是同名的，这样在GraphQL才能把它们对应起来，举个例子，比如 Query user(id: ObjectId!), 它的Resolver的名字必然叫做user。

```
function user (parent, args, ctx) {  //数据获取的具体逻辑
    ...
}
```
其中的参数的意义如下：
```
parent: 当前上一个Resolver的返回值
args: 传入某个Query中的函数（比如上面例子中article(id: Int)中的id）
ctx: 在Resolver解析链中不断传递的中间变量（类似中间件架构中的context)
```


# GraphQL的内部工作机制

```
query {
  articles {
    id
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
GraphQL在解析这段查询语句时会按如下步骤：

- 首先进行第一层解析，当前Query的Root Query类型是query，同时需要它的名字是articles
之后会尝试使用articles的Resolver获取解析数据，第一层解析完毕
之后对第一层解析的返回值，进行第二层解析，当前articles还包含三个子Query，分别是id、author和comments

- id在Author类型中为标量类型，解析结束
author在Author类型中为对象类型User，尝试使用User的Resolver获取数据，当前field解析完毕
之后对第二层解析的返回值，进行第三层解析，当前author还包含一个Query, name，由于它是标量类型，解析结束
- comments同上...
- > **我们可以发现，GraphQL大体的解析流程就是遇到一个Query之后，尝试使用它的Resolver取值，之后再对返回值进行解析，
这个过程是递归的，直到所解析Field的类型是Scalar Type（标量类型）为止。**

- 解析的整个过程我们可以把它想象成一个很长的Resolver Chain（解析链）。


# n+1 问题

```
// GraphQL query
  query {
    comments(page: 1, size: 10) {
      desc,
      author {
        name
      }
    }
  }
  
// query 1 get comments  AND  quey 10 get user by id

```

solve: use dataloader

```
// resolvers implement
const getUsers = async (ids) => {
  const data = await db.user.find({_id: ids})
  return data
}

const userLoader = new DataLoader(getUsers)

const resolvers = {
  Comment: {
    author: async (obj, params) => {
      const data = await userLoader.load(obj.author.toString())
      return data
    }
  }
}

// query 1 get comments  AND  quey 1 get users $in ids
```
```
dataloader caching
load(key)
clear(key)
loadMany(keys)
clearAll()
```

# graphql-yoga
```
graphql-yoga is based on the following libraries & tools:

express/apollo-server: Performant, extensible web server framework
graphql-subscriptions/subscriptions-transport-ws: GraphQL subscriptions server
graphql.js/graphql-tools: GraphQL engine & schema helpers
graphql-playground: Interactive GraphQL IDE
```
```
server.express.use(myMiddleware())
server.express.post(server.options.endpoint, myMiddleware())
```
