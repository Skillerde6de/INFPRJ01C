const pgp = require('pg-promise')(/*options*/)
const db = pgp('postgres://projectc:pc@188.166.94.83:5432/project_dev')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// select * from schilderijen, schilder WHERE schilderijen.id_number = 1 AND principalmaker = name;
var root = {
  status: () => {
    return 200
  },
  collection: () => {
    let query = 'SELECT * from schilderijen limit 15'
    return db.manyOrNone(query)
  },
  collectionSearch: () => {
    let query = 'SELECT * from schilderijen'
    return db.manyOrNone(query)
  },
  async paintingOrderedByPagination ({ page }) {
    let offset = (page - 1) * 10
    // let query = (`SELECT * FROM schilderijen LIMIT 10 OFFSET ${offset}`)

    const total = await db.manyOrNone('SELECT COUNT(*) from schilderijen')
                        .then( data => {
                          return data
                        })

    const preQuery = await db.manyOrNone(`SELECT * FROM schilderijen LIMIT 10 OFFSET ${offset}`)
                        .then( data => {
                          return data
                        })

    return {
      total: total[0].count,
      collection: preQuery
    }
  },
  paintingByID: ({id}) => {
    let query = (`SELECT * from schilderijen where id_number = ${id}`)
    console.log(query)
    return db.manyOrNone(query)
  },
  PaintingsByPainter: ({id}) => {
    let query = (`SELECT * from schilderijen, schilder WHERE schilderijen.id_number = ${id} AND schilderijen.principalmaker = schilder.name`)
    console.log(id)
    console.log(query)
    return db.manyOrNone(query)
  },
  paintersAll: ()=>{
    let query = 'SELECT * from schilder'
    return db.manyOrNone(query)
  },
  painters: () => {
    let query = 'SELECT * from schilder limit 15'
    return db.manyOrNone(query)
  },
  painterByID: ({id}) => {
    let query = (`SELECT * from schilder where id = ${id}`)
    return db.manyOrNone(query)
  },
  workByPainter: ({id}) => {
    let query = (`SELECT * from schilderijen where principalmaker = ${id}`)
    return db.manyOrNone(query)
  },
  faq: () => {
    let query = ('SELECT * from faq')
    return db.manyOrNone(query)
  },

  async me (req, res, next) {
    if (!res.headers.authorization) {
      console.log(`\nUser not authenticated!\n`)
      throw new Error('You are not authenticated!')
    }

    var decoded = jwt.verify(
      String(res.headers.authorization).slice(7),
      'E28BA7D908327F1F8F08E396D60DC6FBCDB734387C2C08FCD2CF8E4C09B36AB7'
    );

    console.log(`\nToken: ${String(res.headers.authorization).slice(7)}`)
    console.log(`ID: ${decoded.id}\n`)

    let query = (`SELECT * from gebruiker where id = ${decoded.id}`)
    return await db.manyOrNone(query)
  },


  //user signup
  async signup ({ name, surname, mail, password, aanhef, adres, city, postalcode}) {
    // Salt password
    const saltedPassword =  await bcrypt.hash(password, 10)

    // Check if a user with the same email exists
    const user = await db.manyOrNone('SELECT mail from gebruiker where mail = $1', [mail])

    // Throw an error when a user with the same email exists
    if (user.length) {
      throw new Error ('User with this email already exists')
    }

    // Generate token when insertion is complete

    return await db.one('INSERT INTO gebruiker(name, surname, mail, password, aanhef, adres, city, postalcode) \
    VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', 
    [name, surname, mail, saltedPassword, aanhef, adres, city, postalcode])
      .then( data => {
        console.log(`\nUser ID: ${data.id}`)
        let tokens = jwt.sign(
              { id: data.id },
              "E28BA7D908327F1F8F08E396D60DC6FBCDB734387C2C08FCD2CF8E4C09B36AB7",
              { expiresIn: '1d' }
            )

        return {
          id: data.id,
          aanhef: aanhef,
          name: name,
          surname: surname,
          email: mail,
          address: adres,
          city: city,
          postalcode: postalcode,
          token: tokens
        }

        // return {
        //   token: jwt.sign(
        //     { id: user[0].id },
        //     "E28BA7D908327F1F8F08E396D60DC6FBCDB734387C2C08FCD2CF8E4C09B36AB7",
        //     { expiresIn: '1d' }
        //   ),
        //   id: data.id
        // }
      })
      .catch( err => {
        throw new Error(err)
        console.log(err)
      })

    // Return token to client
    console.log("Token" + tokenWithId.token);

    const userWithToken = {
      id: 11111,
      aanhef: aanhef,
      name: name,
      surname: surname,
      email: mail,
      address: adres,
      city: city,
      postalcode: postalcode,
      token: tokenWithId.token
    }

    console.log(`User: ${userWithToken}\n`)

    return userWithToken
  },

  //user login
  async login ({email, password}) {
    const user = await db.manyOrNone('SELECT * from gebruiker where mail = $1',[email])
                        .then( data => {
                          return data
                        })

    if (!user) {
      throw new Error('No user with that email')
    }

    const valid = await bcrypt.compare(password, user[0].password)

    if (!valid) {
      throw new Error('Incorrect password')
    }

    console.log(`\nUser ID: ${user[0].id}`)

    let token = jwt.sign(
      { id: user[0].id },
      "E28BA7D908327F1F8F08E396D60DC6FBCDB734387C2C08FCD2CF8E4C09B36AB7",
      { expiresIn: '1d' }
    )
    console.log(`Token: ${token}`)

    const userWithToken = {
      id: user[0].id,
      aanhef: user[0].aanhef,
      name: user[0].name,
      surname: user[0].surname,
      email: user[0].mail,
      address: user[0].adres,
      city: user[0].city,
      postalcode: user[0].postalcode,
      token: token
    }

    return userWithToken
  }
}

module.exports = {
  root
}