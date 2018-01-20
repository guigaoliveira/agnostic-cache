const findType = value =>
  ({}.toString
    .call(value)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase());

const add = (db, opts) => (key, value) => {
  const type = findType(value);
  if (type === "string") return db.set(key, value);
  else if (type === "object") return db.hset(key, value);
  else if (type === "array") return db.hset(key, ...value);
  else {
    if (opts.debug)
      throw TypeError(`The function add have a value with wrong type: ${type}`);
    else return false;
  }
};

const get = (db, opts) => (key, value) => {
  const type = findType(value);
  if (type === "array") return db.hmget(key, value);
  else if (type === "string") return db.get(key);
  else {
    if (opts.debug)
      throw TypeError(`The function get have a value with wrong type: ${type}`);
    else return false;
  }
};
const remove = (db, opts) => (key, value) => {
  const type = findType(value);
  if (type === "array") return db.hdel(key, value);
  else if (type === "string") return db.del(key);
  else {
    if (opts.debug)
      throw TypeError(
        `The function remove have a value with wrong type: ${type}`
      );
    else return false;
  }
};
const contains = (db, opts) => key => db.exists(key);

const adapter = (db, opts = { debug: true }) => {
  return {
    add: add(db, opts),
    get: get(db, opts),
    remove: remove(db, opts),
    contains: contains(db, opts)
  };
};

module.exports = adapter;
