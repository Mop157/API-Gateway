const bcrypt = require('bcryptjs');
const { response } = require('express');

const hashedPassword = bcrypt.hashSync('$2a$10$vCq9oLj1LRQoT5NlDbk/SOjZXD9HyfCwAc3jEVuOHd16RyZ5wcIe.', 10);
const hash = bcrypt.compare("157158", "$2a$10$vCq9oLj1LRQoT5NlDbk/SOjZXD9HyfCwAc3jEVuOHd16RyZ5wcIe.").then(res => console.log(res))

console.log(hash)