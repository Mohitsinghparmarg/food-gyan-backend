const driver = require("../config/db.config");
const bcrypt = require("bcryptjs");


const createUser = async (username, email, password) => {
  if (!username || !email || !password) {
    throw new Error("All fields (username, email, password) are required.");
  }

  const session = driver.session({ database: "neo4j" });

  try {
    
    const normalizedEmail = email.trim().toLowerCase();

   
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      throw new Error("Password hashing failed");
    }

    
    const query = `
      CREATE (u:User {username: $username, email: $email, password: $password})
      RETURN u
    `;

    const result = await session.run(query, {
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return result.records[0].get("u").properties;

  } catch (err) {
    throw new Error(`User creation failed: ${err.message}`);
  } finally {
    await session.close();
  }
};

const findUserByEmail = async (email) => {
  if (!email) {
    throw new Error("Email is required.");
  }

  const session = driver.session({ database: "neo4j" });

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const query = `
      MATCH (u:User {email: $email})
      RETURN u
    `;

    const result = await session.run(query, { email: normalizedEmail });

    if (result.records.length === 0) return null;

    return result.records[0].get("u").properties;

  } catch (err) {
    throw new Error(`Error retrieving user: ${err.message}`);
  } finally {
    await session.close();
  }
};

module.exports = {
  createUser,
  findUserByEmail,
};
