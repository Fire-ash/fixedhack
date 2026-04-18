async function sendEmailToUser(user, subject, body) {
  console.log(`[EMAIL] to=${user.email} subject="${subject}" body="${body.substring(0,80)}..."`);
  return true;
}
module.exports = { sendEmailToUser };
