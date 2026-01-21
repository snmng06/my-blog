const bcrypt = require("bcrypt");

async function test() {
  const password = "1234";
  const wrongPassword = "1111";

  const hash = await bcrypt.hash(password, 10);

  const result1 = await bcrypt.compare(password, hash);
  const result2 = await bcrypt.compare(wrongPassword, hash);

  console.log("원본 비밀번호:", password);
  console.log("해시:", hash);
  console.log("올바른 비밀번호 비교 결과:", result1);
  console.log("틀린 비밀번호 비교 결과:", result2);
}

test();
