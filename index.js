const findType = value =>
  ({}.toString
    .call(value)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase());

const set = db => async (key, value) => {
  const type = findType(value);
  if (type === "string") return db.set(key, value);
  else if (type === "object") return db.hset(key, value);
  else return false;
};

const get = db => async (key, value) => {
  const type = findType(value);
  if (type === "array") return db.hmget(key, value);
  else if (type === "string") return db.get(key);
  else return false;
};

const remove = db => async (key, value) => {
  const type = findType(value);
  if (type === "array") return db.hdel(key, value);
  else if (type === "string") return db.del(key);
  else return false;
};

const has = db => async key => db.exists(key);

const adapter = db => {
  return {
    set: set(db),
    get: get(db),
    has: has(db),
    remove: remove(db)
  };
};

module.exports = adapter;
