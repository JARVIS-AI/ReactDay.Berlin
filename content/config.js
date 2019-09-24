/*
  TODO: Switch to env vars
  setup credentials in circle ci
*/

const development = {
  endpoint: 'https://api-euwest.graphcms.com/v1/ck0qr5av4094801d49206aeqn/master',
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXJzaW9uIjoxLCJ0b2tlbklkIjoiN2Y5ZTE0YzYtOTUwZi00M2Q1LWI0NmQtZmVlNDAzNGQ1MGU4In0.-ciA-_yc1XybCAo7E7JNax_CkGxmbekjn7guE2moNro',
};

const production = {
  endpoint: 'https://api-euwest.graphcms.com/v1/ck0qr5av4094801d49206aeqn/master',
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXJzaW9uIjoxLCJ0b2tlbklkIjoiNDg0NjZiMmMtMGE4ZS00YmY2LTk3MWQtYmZmMmE2NDYyOGExIn0.i8bAfrIkQrSO8IAi3liHXQg6J6ZUMiPsPA60dDPDBqo',
};

module.exports = {
  development,
  production,
};
