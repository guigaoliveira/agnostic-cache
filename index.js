const findType = value =>
  ({}.toString
    .call(value)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase());

const set = db => async (key, value) => {
  if (!key) return false;
  const type = findType(value);
  if (type === "string") return db.set(key, value);
  else if (type === "object") return db.hset(key, value);
  else return false;
};

const get = db => async (key, value) => {
  if (!key) return false;
  const type = findType(value);
  if (type === "array") return db.hmget(key, value);
  else return db.get(key);
};

const remove = db => async (key, value) => {
  if (!key) return false;
  const type = findType(value);
  if (type === "array") return db.hdel(key, value);
  else return db.del(key);
};

const has = db => async key => (key ? db.exists(key) : false);

const expires = db => async (key, time) =>
  key && time ? db.pexpire(key, time) : false;

const adapter = db => ({
  set: set(db),
  get: get(db),
  has: has(db),
  remove: remove(db),
  expires: expires(db)
});

module.exports = adapter;
