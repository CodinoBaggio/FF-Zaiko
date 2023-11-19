function getStorageService(PRIVATE_KEY, SERVICE_ACCOUNT_EMAIL) {
  // Scopeを "https://www.googleapis.com/auth/devstorage.full_control" に設定
  var serverToken = new init(
    PRIVATE_KEY,
    ['https://www.googleapis.com/auth/devstorage.full_control'],
    SERVICE_ACCOUNT_EMAIL
  );

  //トークンを取得するユーザを設定して、トークンを取得
  var tokens = serverToken
    .addUser(SERVICE_ACCOUNT_EMAIL)
    .requestToken()
    .getTokens();

  //アクセストークンを確認
  // Logger.log(tokens[SERVICE_ACCOUNT_EMAIL].token);

  return tokens;
}
