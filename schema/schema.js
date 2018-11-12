const { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    hello: String
    collection: [Collection]
    collectionSearch: [Collection]
    paintingOrderedByPagination(page: Int!): [Collection]
    paintingByID(id: String!): [Painting]
    painters: [Painter]
    painterByID(id: String!): [Painter]
    workByPainter(id: String!): [Painting]
    me: User,
    faq: [FAQ],
    status: Int
  },
  type Mutation {
    signup(name: String!, surname: String!, mail: String!, password: String!, aanhef: String, adres: String, city: String, 
      postalcode: String): UserWithToken!
    login(email: String!, password: String!): UserWithToken!
  },
  type Collection {
    id: ID,
    id_number: Int,
    title: String,
    releasedate: Int,
    period: Int,
    description: String,
    physicalmedium: String,
    amountofpaintings: Int,
    src: String,
    bigsrc: String,
    plaquedescriptiondutch: String,
    principalmakersproductionplaces: String,
    width: Int,
    height: Int,
    principalmaker: String
  },
  type Painting{
    id: String,
    title: String,
    releasedate: Int,
    period: Int,
    description: String,
    physicalmedium: String,
    amountofpaintings: Int,
    src: String,
    bigsrc: String,
    plaquedescriptiondutch: String,
    principalmakersproductionplaces: String,
    width: Int,
    height: Int,
    principalmaker: String
  },
  type Painter{
    name: String,
    id: Int,
    city: String,
    dateofbirth: String,
    dateofdeath: String,
    placeofbirth: String,
    occupation: String,
    nationality: String,
    headerimage: String,
    thumbnail: String,
    description: String
  },
  type User {
    id: Int,
    name: String,
    surname: String,
    email: String,
    address: String,
    city: String,
    postalcode: String,
    password: String,
    aanhef: String
  },
  type UserWithToken {
    id: Int,
    name: String,
    surname: String,
    email: String,
    address: String,
    city: String,
    postalcode: String,
    password: String,
    aanhef: String,
    token: String
  },
  type FAQ{
    id: Int,
    title: String,
    body: String
  }
`)

module.exports = {
  schema
}